#ifndef GLOBAL_DEFINES_H
#define GLOBAL_DEFINES_H
#include <Arduino.h>

#define I2S_CLOCK               20000000
#define SAMPLING_FREQUENCY      (I2S_CLOCK/512)
#define DOWNSAMPLE_FACTOR       (SENSED_SIZE/SAMPLES_SIZE)
#define DOWNSAMPLED_FREQUENCY   (SAMPLING_FREQUENCY/DOWNSAMPLE_FACTOR)
#define REAL_RANGE              (DOWNSAMPLED_FREQUENCY / 2)

#define SAMPLES_SIZE            256
#define SENSED_SIZE             SAMPLING_FREQUENCY/10

#define SENSING_RATE            1000000



#define DOWNSAMPLED__FFT        16

#define GATEWAY_ESPNOW          1
#define GATEWAY_WIFI            2



typedef struct  {
  void * next;
  float fft_values [16];
  int fft_range;
  double decibels;
  unsigned int timestamp;
} sending_list;

typedef struct  {
  int message_type;
  sending_list data;
} data_message;

typedef struct  {
  int message_type;
  double battery_voltage;
} telemetry_message;

typedef struct  {
  char mac[6];
  int messages;
  int ram;
  long running;
} espnow_telemetry_message;

typedef struct  {
  int message_type;
  uint8_t mac[6];
} gateway_time_request;

typedef struct  {
  void * next;
  char mac[6];
  int len;
  int type;
  char* message;
} message_queue;

typedef struct  {
  int message_type;
  uint64_t time;
  int interval;
} gateway_time_sync;


enum message_types {
  GATEWAY_TIME,
  SENSOR_TIME,
  SENSOR_READING,
  SENOSR_TELEMETRY,
  TIME_REQUEST,
  ESPNOW_GATEWAY_TELEMETRY
};




























#endif
