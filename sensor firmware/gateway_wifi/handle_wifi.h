#ifndef HANDLE_ESP_NOW_H
#define HANDLE_ESP_NOW_H


#include <Arduino.h>
#include "handle_spiffs.h"
#include "handle_json.h"

void TaskWifi( void *pvParameters );
void OnDataRecv(const uint8_t * mac, const uint8_t *incomingData, int len);
void init_wifi();
void get_wifi_config();
void send_data();
void update_display();
int get_RTT_average();
int get_sent_in_last_second();
void prepare_jsn_data();
void send_telemetry();
void get_measurement_interval_config();
bool handle_connecting(String current);
uint8_t get_rssi();
String get_ssid();
void add_rtt(long len);
bool post_telemetry();

#endif
