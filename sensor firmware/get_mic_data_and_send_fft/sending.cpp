#include "global_defines.h"
#include <esp_pm.h>
#include <esp_wifi.h>
#include <esp_wifi_internal.h>
#include <esp_wifi_types.h>
#include <esp_now.h>
#include <WiFi.h>
#include "sending_queue.h"
#include "sending.h"
#include "sending_queue.h"


uint8_t specAddress[] = {0x30, 0xAE, 0xA4, 0xC7, 0x89, 0x74};

uint8_t broadcastAddress[] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};
esp_now_peer_info_t peerInfo;
esp_now_peer_info_t peerInfo1;
bool sended = false;
bool sending_succeeded = false;

void setup_wifi_and_LR(){

  // Set device as a Wi-Fi Station
  WiFi.mode(WIFI_STA);
  int a = esp_wifi_set_protocol( ESP_IF_WIFI_STA, WIFI_PROTOCOL_LR);
  hanlde_wifi_init_fail(a);

  // Init ESP-NOW
  if (esp_now_init() != ESP_OK) {
    Serial.println("Error initializing ESP-NOW");
    return;
  }

  esp_now_register_send_cb(OnDataSent);

  memcpy(peerInfo.peer_addr, broadcastAddress, 6);
  peerInfo.channel = 0;
  peerInfo.encrypt = false;

  memcpy(peerInfo1.peer_addr, specAddress, 6);
  peerInfo1.channel = 0;
  peerInfo1.encrypt = false;

  if (esp_now_add_peer(&peerInfo) != ESP_OK) {
    Serial.println("Failed to add peer");
    return;
  }

  if (esp_now_add_peer(&peerInfo1) != ESP_OK) {
    Serial.println("Failed to add peer");
    return;
  }

}




void send_data(){
  long start = millis();
  esp_wifi_start();

  // Add peer
  sending_list * to_send = get_first();

  while(to_send != 0 && millis()-start < 110){


    data_message sending_message;
    memcpy(&sending_message.data, to_send, sizeof(sending_list));
    sending_message.message_type = 0;
    sended = false;

    //esp_err_t result = esp_now_send(specAddress, (uint8_t *) &sending_message, sizeof(data_message));
    esp_err_t result = esp_now_send(broadcastAddress, (uint8_t *) &sending_message, sizeof(data_message));

    if(result == ESP_OK){

      while(!sended){
        delayMicroseconds(10);
      }
    }
    to_send = 0;

    if(sending_succeeded){
      remove_first();
      to_send = get_first();
    }

    sending_succeeded = false;
    sended = false;
  }

  esp_wifi_stop();
}







void OnDataSent(const uint8_t *mac_addr, esp_now_send_status_t status) {
  sending_succeeded = false;
  if(status == ESP_NOW_SEND_SUCCESS){
    sending_succeeded = true;
  }
  sended = true;

}

void hanlde_wifi_init_fail(int a){
  if (a == 0)
  {
    Serial.println(" ");
    Serial.print("Error = ");
    Serial.print(a);
    Serial.println(" , Mode LR OK!");
  }
  else//if some error in LR config
  {
    Serial.println(" ");
    Serial.print("Error = ");
    Serial.print(a);
    Serial.println(" , Error in Mode LR!");
  }

}
