#include "handle_esp_now.h"
#include <Arduino.h>
#include "message_queue.h"
#include <esp_pm.h>
#include <esp_wifi.h>
#include <esp_wifi_types.h>
#include <esp_now.h>
#include <WiFi.h>


typedef struct  {
  void * next;
  double fft_values [16];
  int fft_range;
  double decibels;
  long timestamp;
} sending_list;

typedef struct  {
  int message_type;
  sending_list data;
} data_message;


void OnDataRecv(const uint8_t * mac, const uint8_t *incomingData, int len) {

  add_to_message_queue((char*)incomingData, len, (char*)mac);

  Serial.println(heap_caps_get_free_size(MALLOC_CAP_8BIT));


  if(len == sizeof(data_message)){
    data_message *msg = (data_message *)incomingData;

    Serial.println(msg->data.decibels);

  }

}



void TaskEspNow( void *pvParameters ){


  // init esp_now
  WiFi.mode(WIFI_STA);
    int a = esp_wifi_set_protocol( WIFI_IF_STA, WIFI_PROTOCOL_LR );

    // Init ESP-NOW
    if (esp_now_init() != ESP_OK) {
      Serial.println("Error initializing ESP-NOW");
      return;
    }

    esp_now_register_recv_cb(OnDataRecv);


  for(;;){




    vTaskDelay(1);


  }
}
