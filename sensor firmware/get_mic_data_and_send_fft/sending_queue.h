#ifndef SENDING_QUEUE_H
#define SENDING_QUEUE_H

void add_to_sending_queue(double* fft, double decibels, long timestamp);
void * get_first();
void remove_first();



#endif
