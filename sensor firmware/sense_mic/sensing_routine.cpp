#include "global_defines.h"
#include "handle_time.h"
#include <arduino.h>
#include <esp_pm.h>
#include "sensing_routine.h"
#include "microphone.h"
#include "spectrum_analysis.h"
#include "decibel_calculator.h"
#include "sending_queue.h"
#include "sending.h"
#include "common.h"
#include "handle_oled.h"
#include "handle_json.h"


int samples_pub[SAMPLES_SIZE];
unsigned int sensing_start = 0;

double fft_downsampled[DOWNSAMPLED__FFT];
double decibels = 0.0;

uint8_t mac [6];
String name;

void sync_time_send_telemetry() {}

void do_sensing() {

  // init i2s
  init_i2s();

  // while true loop
  while (true) {

    sensing_and_data_preparation();
    setCpuFrequencyMhz(240);
}
}


void sensing_and_data_preparation(){
  get_samples((int*)&samples_pub);

  // set cpu frequency to 240mhz for processing
  setCpuFrequencyMhz(240);
  // process the data
  calculate_fft((int*)&samples_pub, (double*)&fft_downsampled, DOWNSAMPLED__FFT);
  decibels = 0.0;
  decibels = calculate_decibels((int*)&samples_pub, SAMPLES_SIZE);

  oled_on();


}
