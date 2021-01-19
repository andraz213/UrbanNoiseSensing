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
#include "handle_oled.h"


int sensing_interval = 1;
bool time_recieved = false;
  esp_now_peer_info_t peerInfo;
  const int last_messages_num = 200;
  long last_messages [last_messages_num];
  int last_messages_iter = 0;

void OnDataSent(const uint8_t *mac_addr, esp_now_send_status_t status){

  if(ESP_NOW_SEND_SUCCESS == status){
    time_recieved = true;
    Serial.println("confirmed");
    Serial.println(millis());
  }

}


void OnDataRecv(const uint8_t * mac, const uint8_t *incomingData, int len) {

  int type = 0;
  memcpy(&type, (char*)incomingData, (sizeof(int)));

  char * data = (char*) (incomingData + 2*sizeof(int));
  int datalen = len - 2*sizeof(int);

  if(type == (int)SENOSR_TELEMETRY){
    Serial.println("time_request");
    Serial.println(millis());
    handleTimeRequest((char*)mac);
    handleSensorMessage((uint8_t *)mac, (uint8_t *)incomingData, len, type);
  }

  if(type == (int)SENSOR_READING){
    Serial.println("sensor_reading");
    handleSensorMessage((uint8_t *)mac, (uint8_t *)data, datalen, type);
  }

  last_messages_iter %= last_messages_num;
  last_messages[last_messages_iter] = millis();
  last_messages_iter++;
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
  long prev_oled = millis();
  for (;;) {
    if(millis() - prev_oled > 333){
    int last_second_messages = 0;
    for(int i = 0; i<100; i++){
      if(millis() - last_messages[i] < 1000){
        last_second_messages ++;
      }
    }

    uint8_t * mmm = (uint8_t *) heap_caps_malloc(sizeof(uint8_t) * 6, MALLOC_CAP_8BIT);
    esp_wifi_get_mac(WIFI_IF_STA, mmm);
    String mac = String(mmm[0], HEX) + ":" + String(mmm[1], HEX) + ":" + String(mmm[2], HEX) + ":" + String(mmm[3], HEX) + ":" + String(mmm[4], HEX) + ":" +String(mmm[5], HEX);
    print_text(String("Messages last second"), String(last_second_messages), String(heap_caps_get_free_size(MALLOC_CAP_8BIT)), mac);
    prev_oled = millis();
    free(mmm);
  }
    vTaskDelay(1);
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


  if (len == sizeof(telemetry_message)) {
    for(int i = 0; i<len; i++){
      Serial.println(incomingData[i], HEX);
    }
    telemetry_message *msg;
    Serial.println((long)msg);
    msg = (telemetry_message *)incomingData;
    Serial.println(((telemetry_message *)incomingData)->battery_voltage);
    Serial.println((mac[4] + mac[2] + mac[3]) % 5);
  }



  if (len == sizeof(sending_list)) {
    sending_list *msg;
    Serial.println((long)msg);
    msg = (sending_list *)incomingData;
    Serial.println(((sending_list *)incomingData)->decibels);
    Serial.println((((sending_list *)incomingData)->timestamp)%100);


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
    int size = 2*sizeof(int) + sizeof(int64_t);
    int message_typ = (int)SENSOR_TIME;
    char* message = (char*)heap_caps_malloc(size, MALLOC_CAP_8BIT);
    memcpy(message, (char*)&message_typ, sizeof(int));
    memcpy(message + sizeof(int), (char*)&time_us, sizeof(int64_t));
    memcpy(message + sizeof(int) + sizeof(int64_t), (char*)&sensing_interval, sizeof(int));
    esp_err_t result = esp_now_send((uint8_t *)mac, (uint8_t *)message, (size_t)size);
      Serial.println("seded");
        Serial.println(millis());
    if(ESP_OK == result){
      esp_now_del_peer((uint8_t *)mac);
    }

    free(message);
  }

}


int get_meesages_last_mil(int mil){
  int res = 0;
  for(int i = 0; i<last_messages_num; i++){
    if(last_messages[i] <= mil){
      res += 1;
    }

  }

  return res;
}

void set_sensing_interval(int interval){
  sensing_interval = interval;
  Serial.println("sensing interval:");
  Serial.println(sensing_interval);
}
