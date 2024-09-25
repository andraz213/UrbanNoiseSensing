#ifndef SENDING_QUEUE_H
#define SENDING_QUEUE_H
#include <arduino.h>
#include "global_defines.h"
void add_to_sending_queue(double* fft, double decibels, unsigned int timestamp);
sending_list * get_first();
void remove_first();



#endif
