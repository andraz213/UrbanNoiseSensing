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

void OnDataSent(const uint8_t *mac_addr, esp_now_send_status_t status){

  if(ESP_NOW_SEND_SUCCESS == status){
    time_recieved = true;
  }

}


void OnDataRecv(const uint8_t * mac, const uint8_t *incomingData, int len) {

  int type = 0;
  memcpy(&type, (char*)incomingData, (sizeof(int)));

  char * data = (char*)heap_caps_malloc(sizeof(char) * len - sizeof(int), MALLOC_CAP_8BIT);
  int datalen = len - sizeof(int);
  memcpy(data, incomingData + sizeof(int), datalen);

  if(type == (int)TIME_REQUEST){
    Serial.println("time_request");
    handleTimeRequest(mac);
  }

  if(type == (int)SENSOR_READING){
    Serial.println("sensor_reading");
    handleSensorReading(mac, data, datalen);
  }
  free(data);
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


void handleSensorReading(const uint8_t * mac, const uint8_t *incomingData, int len){
  char * tmp = (char*)heap_caps_malloc(sizeof(char) * len, MALLOC_CAP_8BIT);
  memcpy(tmp, incomingData, len);
  char * tmpmac = (char*)heap_caps_malloc(sizeof(char) * 6, MALLOC_CAP_8BIT);
  memcpy(tmpmac, mac, 6);
  add_to_message_queue((char*)tmp, len, (char*)tmpmac);

  free(tmpmac);
  free(tmp);
  Serial.println(heap_caps_get_free_size(MALLOC_CAP_8BIT));


  if (len == sizeof(data_message)) {
    data_message *msg = (data_message *)incomingData;

    Serial.println(msg->data.decibels);

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
  esp_now_peer_info_t peerInfo;
  memcpy(peerInfo.peer_addr, mac, 6);
  peerInfo.channel = 0;
  peerInfo.encrypt = false;
  time_recieved = false


  if(ESP_OK == esp_now_add_peer(peerInfo)){
    int64_t time_us = get_us_time();
    int size = sizeof(int) + sizeof(int64_t);
    int message_typ = (int)SENSOR_TIME;
    char* message = (char*)heap_caps_malloc(size, MALLOC_CAP_8BIT);
    memcpy(message, (char*)&message_typ, sizeof(int));
    memcpy(message + sizeof(int), (char*)&time_us, sizeof(int64_t));
    esp_err_t result = esp_now_send(mac, (uint8_t *)message, (size_t)size);

    if(ESP_OK == result){
      long start = millis();
      while(!time_recieved && millis() - start < 70){
        delay(2);
      }
      esp_now_del_peer(mac);
    }

    free(message);
  }

}
