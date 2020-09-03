#ifndef HANDLE_SERIAL_H
#define HANDLE_SERIAL_H
#include <Arduino.h>

void TaskSerial( void *pvParameters );
void handle_time_request(uint8_t *payload);
void handle_sensor_reading(char* data, int datalen);


#endif
