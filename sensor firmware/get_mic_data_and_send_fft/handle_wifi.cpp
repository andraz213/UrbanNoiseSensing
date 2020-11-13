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

bool post_telemetry(const char* serverName, String version, double bat_voltage) {
  uint8_t mac[6];
  esp_wifi_get_mac(WIFI_IF_STA, mac);
  String url = String(serverName) + String("/api/sensor/telemetry/");
  String body = "[{\"mac\":[" + String(mac[0]) + "," + String(mac[1]) + "," + String(mac[2]) + "," + String(mac[3]) + "," + String(mac[4]) + "," + String(mac[5]) + "], \"battery_voltage\":" + String(bat_voltage) + "}]";
  Serial.println(url);
  HTTPClient http;
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  int httpResponseCode = http.POST(body);
  Serial.println(httpResponseCode);

  if (httpResponseCode == 200) {
    return true;
  }
  return false;


};

bool say_hi_get_config(const char* serverName) {

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


  String result = http.getString();

  Serial.println(write_config(result));
  Serial.println(result.length());
  get_config();

  //http.end();
  if (httpResponseCode == 200) {
    return true;
  }
  return false;

}

bool handle_OTA();

void connect_wifi(const char* ssid, const char* password) {


  if (WiFi.status() != WL_CONNECTED) {
    WiFi.mode(WIFI_STA);
    int a = esp_wifi_set_protocol( WIFI_IF_STA, WIFI_PROTOCOL_11B | WIFI_PROTOCOL_11G | WIFI_PROTOCOL_11N );
    WiFi.begin(ssid, password);
    Serial.println("Connecting");
    int i = 0;
    while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(".");
      i++;
      if (i > 60) {
        ESP.restart();
      }
    }
  }




}
