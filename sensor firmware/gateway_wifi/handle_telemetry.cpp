#include "handle_telemetry.h"
#include <ArduinoJson.h>

int espnow_ram = 0;
int espnow_messages = 0;
long espnow_alive = 0;
int wifi_rtt = 0;
int wifi_ram = 0;
long wifi_alive = 0;
int wifi_rssi = 0;
int wifi_messages = 0;
String wifi_ssid = "";
StaticJsonDocument<255> doc_tele;


void set_espnow_ram(int ram){
  espnow_ram = ram;
}
void set_espnow_alive(long alive){
  espnow_alive = alive;
}
void set_espnow_messages(int messages){
  espnow_messages = messages;
}

void set_wifi_RTT(int rtt){
  wifi_rtt = rtt;
}
void set_wifi_ram(int ram){
  wifi_ram = ram;
}
void set_wifi_alive(long alive){
  wifi_alive = alive;
}
void set_wifi_ssid(String ssid){
  wifi_ssid = ssid;
}
void set_wifi_rssi(int rssi){
  wifi_rssi = rssi;
}
void set_wifi_messages(int messages){
  wifi_messages = messages;
}

String get_telemetry_json(){
  StaticJsonDocument<255> doc_tele;
  Serial.println(wifi_ssid);
  doc_tele["espnow_ram"] = espnow_ram;
  doc_tele["espnow_messages"] = espnow_messages;
  doc_tele["espnow_alive"] = espnow_alive;
  doc_tele["wifi_rtt"] = wifi_rtt;
  doc_tele["wifi_ram"] = wifi_ram;
  doc_tele["wifi_alive"] = wifi_alive;
  doc_tele["wifi_rssi"] = wifi_rssi;
  doc_tele["wifi_messages"] = wifi_messages;
  doc_tele["wifi_ssid"] = wifi_ssid;


  String output;
  serializeJson(doc_tele, output);
  return output;
}
