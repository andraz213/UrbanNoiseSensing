#ifndef HANDLE_WIFI_H
#define HANDLE_WIFI_H

#include "handle_json.h"
#include "handle_spiffs.h"

bool post_telemetry(const char* serverName, String version, double bat_voltage);

bool say_hi_get_config(const char* serverName);

bool handle_OTA();

void connect_wifi(const char* ssid, const char* password);

#endif
