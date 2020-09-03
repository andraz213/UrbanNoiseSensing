#include "handle_wifi.h"
#include <Arduino.h>
#include "message_queue.h"
#include <esp_pm.h>
#include <esp_wifi.h>
#include <esp_wifi_internal.h>
#include <esp_wifi_types.h>
#include <esp_now.h>
#include <WiFi.h>
#include <WiFiMulti.h>
#include <HTTPClient.h>
#include "handle_time.h"
#include "handle_oled.h"
#include "internal_config.h"
const char* ssid = "UNSwifi";
const char* password = "uns12wifi34";
const char* serverName = "http://urbannoisesensing.herokuapp.com";


void init_wifi() {
  if (WiFi.status() != WL_CONNECTED) {
    print_text(String("Connecting to "), String(ssid), "", "");
    Serial.println("wifi");
    // init esp_now
    WiFi.mode(WIFI_STA);
    int a = esp_wifi_set_protocol( WIFI_IF_STA, WIFI_PROTOCOL_11B | WIFI_PROTOCOL_11G | WIFI_PROTOCOL_11N );
    WiFi.begin(ssid, password);
    long start_wifi_connect = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - start_wifi_connect < 60000) {
      Serial.print("|");
      delay(250);
    }
    init_time();

    print_text(String("Success!"), String(ssid), "", "");
    delay(1000);
  }


}

void TaskWifi( void *pvParameters ) {




  for (;;) {
    /*long start = millis();
    get_config();

    Serial.println(millis() - start);
    Serial.println("-----------------------------------------");*/

    vTaskDelay(10);

  }
}

void get_config(){

  uint8_t mac [6];

  if(get_espnow_mac(mac)){
    String body = "{\"mac\":[" + String(mac[0]) + "," + String(mac[1]) + "," + String(mac[2]) + "," + String(mac[3]) + "," + String(mac[4]) + "," + String(mac[5]) + "]}";

    Serial.println(body);
    String url = String(serverName) + String("/api/gateway/");
    Serial.println(url);
    HTTPClient http;
    http.begin(url);
    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.POST(body);
    Serial.println(httpResponseCode);


    String result = http.getString();

    Serial.println(result);
    Serial.println(result.length());

    //http.end();
    /*
    if (httpResponseCode == 200) {
      return true;
    }
    return false;

  }*/
}
}



void send_data(){



















}
