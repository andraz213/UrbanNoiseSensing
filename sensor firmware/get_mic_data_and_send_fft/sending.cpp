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
#include "handle_time.h"
#include "handle_json.h"


uint8_t mac_address [6];
esp_now_peer_info_t peerInfo;
esp_now_peer_info_t peerInfo1;
bool sended = false;
bool sending_succeeded = false;

void setup_wifi_and_LR() {

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
  esp_now_register_recv_cb(OnDataRecv);

  get_gateway_mac(mac_address);

  memcpy(peerInfo.peer_addr, mac_address, 6);
  peerInfo.channel = 0;
  peerInfo.encrypt = false;


  if (esp_now_add_peer(&peerInfo) != ESP_OK) {
    Serial.println("Failed to add peer");
    return;
  }

  if (esp_now_add_peer(&peerInfo1) != ESP_OK) {
    Serial.println("Failed to add peer");
    return;
  }

}




void send_data() {
  long start = millis();


  // Add peer
  sending_list * to_send = get_first();


  while (to_send != 0 && millis() - start < 110) {

    data_message sending_message;
    memcpy(&sending_message.data, to_send, sizeof(sending_list));
    sending_message.message_type = (int)SENSOR_READING;
    sended = false;


    //esp_err_t result = esp_now_send(specAddress, (uint8_t *) &sending_message, sizeof(data_message));
    esp_err_t result = esp_now_send(mac_address, (uint8_t *) &sending_message, sizeof(data_message));

    if (result == ESP_OK) {

      while (!sended) {
        delayMicroseconds(10);
      }
    }
    to_send = 0;

    if (sending_succeeded) {
      remove_first();
      to_send = get_first();
    }

    sending_succeeded = false;
    sended = false;
  }


}



void OnDataRecv(const uint8_t * mac, const uint8_t *incomingData, int len) {

  int type = 0;
  memcpy(&type, (char*)incomingData, (sizeof(int)));

  char * data = (char*) (incomingData + sizeof(int));
  int datalen = len - sizeof(int);

  if (type == (int)SENSOR_TIME) {
    Serial.println("time_request");
    handle_gateway_time((char*)incomingData, len);
  }

}



void OnDataSent(const uint8_t *mac_addr, esp_now_send_status_t status) {
  sending_succeeded = false;
  if (status == ESP_NOW_SEND_SUCCESS) {
    sending_succeeded = true;
  }
  sended = true;

}

void hanlde_wifi_init_fail(int a) {
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
