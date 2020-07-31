#ifndef SENDING_QUEUE_H
#define SENDING_QUEUE_H

typedef struct  {
  void * next;
  double fft_values [DOWNSAMPLED__FFT];
  int fft_range;
  double decibels;
  long timestamp;
} sending_list;


void add_to_sending_queue(double* fft, double decibels, long timestamp);
void * get_first();
void remove_first();



#endif
