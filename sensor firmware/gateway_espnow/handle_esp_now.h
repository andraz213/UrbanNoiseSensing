#ifndef HANDLE_ESP_NOW_H
#define HANDLE_ESP_NOW_H


#include <Arduino.h>

void TaskEspNow( void *pvParameters );
void OnDataRecv(const uint8_t * mac, const uint8_t *incomingData, int len);
void init_wifi();
void handleTimeRequest(char* mac);
handleSensorReading(const uint8_t * mac, const uint8_t *incomingData, int len);

#endif
