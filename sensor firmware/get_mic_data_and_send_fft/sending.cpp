#include "global_defines.h"
#include <esp_pm.h>
#include <esp_wifi.h>
#include <esp_wifi_internal.h>
#include <esp_wifi_types.h>
#include <esp_now.h>
#include <WiFi.h>
#include "sending_queue.h"
#include "sending.h"

//uint8_t broadcastAddress[] = {0x30, 0xAE, 0xA4, 0x9D, 0x62, 0xF4};

uint8_t broadcastAddress[] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};
esp_now_peer_info_t peerInfo;

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

  memcpy(peerInfo.peer_addr, broadcastAddress, 6);
  peerInfo.channel = 0;
  peerInfo.encrypt = false;

}




void send_data(){
  esp_wifi_start();
  esp_now_register_send_cb(OnDataSent);
  // Add peer
  if (esp_now_add_peer(&peerInfo) != ESP_OK) {
    Serial.println("Failed to add peer");
    return;
  }



  esp_now_unregister_send_cb();
  esp_wifi_stop();
}







void OnDataSent(const uint8_t *mac_addr, esp_now_send_status_t status) {
  Serial.println(status == ESP_NOW_SEND_SUCCESS ? "Delivery Success" : "Delivery Fail");
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
