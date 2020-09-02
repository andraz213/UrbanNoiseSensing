
#ifndef MAINTANENCE_H
#define MAINTANENCE_H

#include <ArduinoJson.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include "esp_wifi.h"
#include "handle_json.h"





void do_maintanence();
void connect_and_get_data();
void do_sensing_for_test();
void connect_and_send_telemetry();


#endif
