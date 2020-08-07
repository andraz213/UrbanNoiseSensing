#ifndef GLOBAL_DEFINES_H
#define GLOBAL_DEFINES_H

#define I2S_CLOCK               20000000
#define SAMPLING_FREQUENCY      (I2S_CLOCK/512)
#define DOWNSAMPLE_FACTOR       (SENSED_SIZE/SAMPLES_SIZE)
#define DOWNSAMPLED_FREQUENCY   (SAMPLING_FREQUENCY/DOWNSAMPLE_FACTOR)

#define SAMPLES_SIZE            256
#define SENSED_SIZE             SAMPLING_FREQUENCY/10

#define SENSING_RATE            1000000



#define DOWNSAMPLED__FFT        16

#define GATEWAY_ESPNOW          1
#define GATEWAY_WIFI            2



typedef struct  {
  void * next;
  double fft_values [16];
  int fft_range;
  double decibels;
  long timestamp;
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

} espnow_telemetry_message;



typedef struct  {
  void * next;
  char mac[6];
  int len;
  char* message;
} message_queue;


enum message_types {
  GATEWAY_TIME,
  SENSOR_TIME,
  SENSOR_READING,
  SENOSR_TELEMETRY,
  TIME_REQUEST,
  ESPNOW_GATEWAY_TELEMETRY
};




























#endif
