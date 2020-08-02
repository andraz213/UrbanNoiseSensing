#ifndef SENDING_H
#define SENDING_H

#include <esp_pm.h>
#include <esp_wifi.h>
#include <esp_wifi_internal.h>
#include <esp_wifi_types.h>
#include <esp_now.h>
#include <WiFi.h>
#include "sending_queue.h"

typedef struct  {
  int message_type;
  sending_list data;
} data_message;

typedef struct  {
  int message_type;
  double battery_voltage;
} telemetry_message;

void setup_wifi_and_LR();
void send_data();
void OnDataSent(const uint8_t *mac_addr, esp_now_send_status_t status);
void hanlde_wifi_init_fail(int a);


#endif
