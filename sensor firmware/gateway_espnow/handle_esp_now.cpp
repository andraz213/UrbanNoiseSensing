#include "handle_esp_now.h"
#include "global_defines.h"
#include <Arduino.h>
#include "message_queue.h"
#include <esp_pm.h>
#include <esp_wifi.h>
#include <esp_wifi_types.h>
#include <esp_now.h>
#include <WiFi.h>
#include "apps/sntp/sntp.h"
#include <sys/time.h>

bool time_recieved = false;
  esp_now_peer_info_t peerInfo;

void OnDataSent(const uint8_t *mac_addr, esp_now_send_status_t status){

  if(ESP_NOW_SEND_SUCCESS == status){
    time_recieved = true;
  }

}


void OnDataRecv(const uint8_t * mac, const uint8_t *incomingData, int len) {

  int type = 0;
  memcpy(&type, (char*)incomingData, (sizeof(int)));

  char * data = (char*) (incomingData + 2*sizeof(int));
  int datalen = len - 2*sizeof(int);

  if(type == (int)SENOSR_TELEMETRY){
    Serial.println("time_request");
    handleTimeRequest((char*)mac);
  }

  if(type == (int)SENSOR_READING || type == (int) SENOSR_TELEMETRY){
    Serial.println("sensor_reading");
    handleSensorMessage((uint8_t *)mac, (uint8_t *)data, datalen, type);
  }

}

void init_wifi() {

  Serial.println("wifi");
  // init esp_now
  WiFi.mode(WIFI_STA);
  int a = esp_wifi_set_protocol( WIFI_IF_STA, WIFI_PROTOCOL_LR );
  Serial.println("esp_now_init");
  // Init ESP-NOW
  if (esp_now_init() != ESP_OK) {
    Serial.println("Error initializing ESP-NOW");
    return;
  }

  esp_now_register_recv_cb(OnDataRecv);
  esp_now_register_send_cb(OnDataSent);
}


void TaskEspNow( void *pvParameters ) {

  for (;;) {

    vTaskDelay(100);
  }
}

float decibelis [100][4];

void handleSensorMessage(uint8_t * mac, uint8_t *incomingData, int len, int type){
  char * tmp = (char*)heap_caps_malloc(sizeof(char) * len, MALLOC_CAP_8BIT);
  memcpy(tmp, incomingData, len);
  char * tmpmac = (char*)heap_caps_malloc(sizeof(char) * 6, MALLOC_CAP_8BIT);
  memcpy(tmpmac, mac, 6);
  add_to_message_queue((char*)tmp, len, (char*)tmpmac, type);

  free(tmpmac);
  free(tmp);
  Serial.println(heap_caps_get_free_size(MALLOC_CAP_8BIT));

/*
  for(int i = 0; i<len; i++){
    Serial.print(incomingData[i], HEX);
  }*/


  if (len == sizeof(sending_list)) {
    sending_list *msg;
    Serial.println((long)msg);
    msg = (sending_list *)incomingData;
    Serial.println(((sending_list *)incomingData)->decibels);
    Serial.println((((sending_list *)incomingData)->timestamp)%100);
    Serial.println((mac[4] + mac[2] + mac[3]) % 5);

    decibelis[(((sending_list *)incomingData)->timestamp)%100][(mac[4] + mac[2] + mac[3]) % 5] = (float) ((sending_list *)incomingData)->decibels;

  }

  if((((sending_list *)incomingData)->timestamp)%100 == 99 && (mac[4] + mac[2] + mac[3]) % 5 == 0){


    float prvi = 0.0;
    float drugi = 0.0;
    float tretji = 0.0;
    float cetrti = 0.0;

    float avgmae = 0.0;
    float avgrmse = 0.0;
    for(int j = 0; j<90; j++){
      float avg = decibelis[j][0] + decibelis[j][1] + decibelis[j][3];

      avg /= 3.0;

      float rmse = (decibelis[j][0] - avg)/avg * (decibelis[j][0] - avg)/avg + (decibelis[j][1] - avg)/avg * (decibelis[j][1] - avg)/avg + (decibelis[j][3] - avg)/avg * (decibelis[j][3] - avg)/avg;

      float mae = abs(decibelis[j][0] - avg) + abs(decibelis[j][1] - avg) + abs(decibelis[j][3] - avg);

      mae *= 100.0/(3.0 * avg);


      prvi += (decibelis[j][0] - avg)*100.0/avg;
      drugi += (decibelis[j][1] - avg)*100.0/avg;
      tretji += (decibelis[j][3] - avg)*100.0/avg;

      cetrti += (0.0 - avg)/avg;

      rmse /= 3.0;

      rmse = sqrt(rmse);

      avgmae += mae;
      avgrmse += rmse;
      Serial.println(rmse);
      Serial.println(mae);
      Serial.println();

    }
    Serial.println("-------------------------");
    prvi /= 90.0;
    drugi /= 90.0;
    tretji /= 90.0;
    cetrti /= 90.0;
    avgmae /= 90.0;
    avgrmse /= 90.0;
    Serial.println(prvi);
    Serial.println(drugi);
    Serial.println(tretji);
    Serial.println(cetrti);
    Serial.println(avgrmse);
    Serial.println(avgmae);
  }






}

int64_t get_us_time() {

  struct timeval tv_now;
  gettimeofday(&tv_now, NULL);
  int64_t time_us = (int64_t)tv_now.tv_sec * 1000000L + (int64_t)tv_now.tv_usec;
  if (time_us < 1596564101135794) {
    return -1;
  }
  return time_us;
}



void handleTimeRequest(char* mac){

  memcpy(peerInfo.peer_addr, mac, 6);
  peerInfo.channel = 0;
  peerInfo.encrypt = false;
  time_recieved = false;


  if(ESP_OK == esp_now_add_peer(&peerInfo)){
    int64_t time_us = get_us_time();
    int size = sizeof(int) + sizeof(int64_t);
    int message_typ = (int)SENSOR_TIME;
    char* message = (char*)heap_caps_malloc(size, MALLOC_CAP_8BIT);
    memcpy(message, (char*)&message_typ, sizeof(int));
    memcpy(message + sizeof(int), (char*)&time_us, sizeof(int64_t));
    esp_err_t result = esp_now_send((uint8_t *)mac, (uint8_t *)message, (size_t)size);

    if(ESP_OK == result){
      long start = millis();
      while(!time_recieved && millis() - start < 70){
        delay(2);
      }
      esp_now_del_peer((uint8_t *)mac);
    }

    free(message);
  }

}
