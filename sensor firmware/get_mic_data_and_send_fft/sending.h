#ifndef SENDING_H
#define SENDING_H
#include "global_defines.h"
#include <esp_pm.h>
#include <esp_wifi.h>
#include <esp_wifi_internal.h>
#include <esp_wifi_types.h>
#include <esp_now.h>
#include <WiFi.h>
#include "sending_queue.h"



void setup_wifi_and_LR();
void send_data();
void OnDataSent(const uint8_t *mac_addr, esp_now_send_status_t status);
void hanlde_wifi_init_fail(int a);


#endif
