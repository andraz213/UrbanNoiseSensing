#ifndef HANDLE_JSON_H
#define HANDLE_JSON_H
#include <ArduinoJson.h>
#include "handle_spiffs.h"

void get_gateway_mac(uint8_t * mac);

String get_config_name();

String get_sensor_id();

String get_current_deployment();

int parse_interval_config(String json);

#endif
