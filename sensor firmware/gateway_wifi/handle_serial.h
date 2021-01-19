#ifndef HANDLE_SERIAL_H
#define HANDLE_SERIAL_H
#include <Arduino.h>

void TaskSerial( void *pvParameters );
void handle_time_request(uint8_t *payload);
void handle_espnow_telemetry(uint8_t *payload);
void handle_sensor_reading(char * mac, char * data, int datalen, int type);
void handle_sensor_telemetry(char * mac, char * data, int datalen, int type);

#endif
