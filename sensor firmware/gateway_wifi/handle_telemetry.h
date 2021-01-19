#ifndef HANDLE_TELEMETRY_H
#define HANDLE_TELEMETRY_H
#include <Arduino.h>



void set_espnow_ram(int ram);
void set_espnow_alive(long alive);
void set_espnow_messages(int messages);

void set_wifi_RTT(int rtt);
void set_wifi_ram(int ram);
void set_wifi_alive(long alive);
void set_wifi_ssid(String ssid);
void set_wifi_rssi(int rssi);
void set_wifi_messages(int messages);

String get_telemetry_json();

#endif
