#ifndef HANDLE_TIME_H
#define HANDLE_TIME_H
#include <Arduino.h>

void init_time();
void print_time();
int64_t get_us_time();
int get_measurement_interval();
void set_measurement_interval(int interval);
#endif
