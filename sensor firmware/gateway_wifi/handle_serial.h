#ifndef HANDLE_SERIAL_H
#define HANDLE_SERIAL_H

void TaskSerial( void *pvParameters );
void handle_time_request();
void handle_sensor_reading(char* data, int datalen);


#endif
