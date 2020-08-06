#include "handle_esp_now.h"
#include "global_defines.h"
#include <Arduino.h>
#include "message_queue.h"
#include <esp_pm.h>
#include <esp_wifi.h>
#include <esp_wifi_types.h>
#include <esp_now.h>
#include <WiFi.h>



void OnDataRecv(const uint8_t * mac, const uint8_t *incomingData, int len) {
  Serial.println("hej recieve");
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
}


void TaskEspNow( void *pvParameters ) {



  for (;;) {


    vTaskDelay(1000);
  }
}
