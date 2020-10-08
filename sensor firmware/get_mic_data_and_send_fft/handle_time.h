#ifndef HANDLE_TIME_H
#define HANDLE_TIME_H


void sync_time_and_telemetry();

long get_random_sleep_time();

long get_remaining_sleep_time();

void handle_gateway_time(char *payload, int length);

void print_usec();

unsigned int get_secs();

unsigned int get_usecs();

int get_interval();

bool is_interval_now();
#endif
