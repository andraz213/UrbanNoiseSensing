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
void setup_wifi_and_LR(){

  // Set device as a Wi-Fi Station
  WiFi.mode(WIFI_STA);
  int a = esp_wifi_set_protocol( ESP_IF_WIFI_STA, WIFI_PROTOCOL_LR);
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

  // Init ESP-NOW
  if (esp_now_init() != ESP_OK) {
    Serial.println("Error initializing ESP-NOW");
    return;
  }

  // Once ESPNow is successfully Init, we will register for Send CB to
  // get the status of Trasnmitted packet
  esp_now_register_send_cb(OnDataSent);

  // Register peer
  esp_now_peer_info_t peerInfo;
  memcpy(peerInfo.peer_addr, broadcastAddress, 6);
  peerInfo.channel = 0;
  peerInfo.encrypt = false;

  // Add peer
  if (esp_now_add_peer(&peerInfo) != ESP_OK) {
    Serial.println("Failed to add peer");
    return;
  }



}




void send_data(){




}







void OnDataSent(const uint8_t *mac_addr, esp_now_send_status_t status) {
  //Serial.println(micros() - sending_start);
  //Serial.print("\r\nLast Packet Send Status:\t");
  //Serial.println(status == ESP_NOW_SEND_SUCCESS ? "Delivery Success" : "Delivery Fail");



  /*esp_wifi_stop();
    setCpuFrequencyMhz(80);
    int sleeptime = 1000;// - (micros() - prev_wake);
    Serial.println(sleeptime);
    esp_sleep_enable_timer_wakeup(sleeptime);
    esp_light_sleep_start();
    //esp_wifi_start();
    setCpuFrequencyMhz(80);
    Serial.println("wifi is off");
    delay(30);
    Serial.println("wifi is on");
    Serial.println(esp_wifi_start());
    Serial.println("out of light sleep");*/
}
