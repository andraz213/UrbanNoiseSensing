#include "global_defines.h"
#include <arduino.h>
#include <esp_pm.h>
#include "sensing_routine.h"
#include "microphone.h"
#include "spectrum_analysis.h"
#include "decibel_calculator.h"

int samples_pub[SAMPLES_SIZE];

double fft_downsampled[DOWNSAMPLED__FFT];
double decibels = 0.0;

void setup_wifi_and_LR(){}





void sync_time_send_telemetry(){}



void send_data(){}





void do_sensing(){

// setup wifi LR and espnow


// init i2s

  init_i2s();

// sync time



// while true loop

while(true){
  long prev = micros();


  // set cpu frequency to 20mhz to lower the consumption
  setCpuFrequencyMhz(20);
  // get the sensor data
  get_samples((int*)&samples_pub);

  // set cpu frequency to 240mhz for processing
  setCpuFrequencyMhz(240);
  // process the data
  calculate_fft((int*)&samples_pub, (double*)&fft_downsampled, DOWNSAMPLED__FFT);
  decibels = 0.0;
  decibels = calculate_decibels((int*)&samples_pub, SAMPLES_SIZE);


  // put data into a sending queue




// sleep for a random amount of time to prevent signal congestion
  setCpuFrequencyMhz(20);
  long left = SENSING_RATE - (micros() - prev);
  int random_sleep = random(left - 150000);


  if(random_sleep > 0){
    esp_sleep_enable_timer_wakeup(random_sleep);
    esp_light_sleep_start();
  }


// set cpu frequency to 80mhz for sending
setCpuFrequencyMhz(80);
// do the sending




// enter light sleep
setCpuFrequencyMhz(10);

//Serial.println(left);
long bf_slp = micros();
left = 1000000 - (bf_slp % 1000000);
if(left > 0){
  esp_sleep_enable_timer_wakeup(left);
  esp_light_sleep_start();
}



// every few minutes send telemetry and synchronise time
}
}
