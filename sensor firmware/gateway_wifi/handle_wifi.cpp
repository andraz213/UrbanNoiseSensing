#include "handle_wifi.h"
#include <Arduino.h>
#include "message_queue.h"
#include <esp_pm.h>
#include <esp_wifi.h>
#include <esp_wifi_types.h>
#include <esp_now.h>
#include <WiFi.h>
#include "handle_time.h"




void init_wifi() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("wifi");
    // init esp_now
    WiFi.mode(WIFI_STA);
    int a = esp_wifi_set_protocol( WIFI_IF_STA, WIFI_PROTOCOL_11B | WIFI_PROTOCOL_11G | WIFI_PROTOCOL_11N );
    WiFi.begin("ummm", "juha2001");
    while (WiFi.status() != WL_CONNECTED) {
      Serial.print("|");
      delay(250);
    }
    init_time();
  }


}

void TaskEspNow( void *pvParameters ) {




  for (;;) {
    init_wifi();
    vTaskDelay(1000);

  }
}
