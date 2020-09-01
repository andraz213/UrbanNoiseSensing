#include <Arduino.h>
#include "handle_wifi.h"
#include <esp_pm.h>
#include <esp_wifi.h>
#include <esp_wifi_internal.h>
#include <esp_wifi_types.h>
#include <esp_now.h>
#include <WiFi.h>
#include <WiFiMulti.h>

#include <HTTPClient.h>

bool post_telemetry();

bool say_hi_get_config(const char* serverName){

  uint8_t mac[6];
  esp_wifi_get_mac(WIFI_IF_STA, mac);

  String body = "{\"mac\":[" + String(mac[0]) + "," + String(mac[1]) + "," + String(mac[2]) + "," + String(mac[3]) + "," + String(mac[4]) + "," + String(mac[5]) + "]}";

  Serial.println(body);
  String url = String(serverName) + String("/api/sensor/");
  Serial.println(url);
  HTTPClient http;
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  int httpResponseCode = http.POST(body);
  Serial.println(httpResponseCode);


  Serial.println(http.getString());


  //http.end();

return true;

}

bool handle_OTA();

void connect_wifi(const char* ssid, const char* password){


  if (WiFi.status() != WL_CONNECTED) {
    WiFi.mode(WIFI_STA);
    int a = esp_wifi_set_protocol( WIFI_IF_STA, WIFI_PROTOCOL_11B | WIFI_PROTOCOL_11G | WIFI_PROTOCOL_11N );
    WiFi.begin(ssid, password);
    Serial.println("Connecting");
    while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(".");
    }
  }




}
