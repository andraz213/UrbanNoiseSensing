#ifndef SENDING_QUEUE_H
#define SENDING_QUEUE_H

#include "global_defines.h"
void add_to_sending_queue(double* fft, double decibels, long timestamp);
sending_list * get_first();
void remove_first();



#endif
