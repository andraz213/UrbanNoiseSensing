
#include <arduino.h>
#include <esp_pm.h>
#include "sensing_routine.h"
#include "microphone.h"
#include "spectrum_analysis.h"
#include "decibel_calculator.h"

int samples_pub[SAMPLES_SIZE];

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
setCpuFrequencyMhz(240);
// get the sensor data
    get_samples((int*)&samples_pub);

// set cpu frequency to 240mhz for processing
setCpuFrequencyMhz(240);
// process the data



    calculate_fft((int*)&samples_pub);
    calculate_decibels((int*)&samples_pub, SAMPLES_SIZE);

// sleep for a random amount of time to prevent signal congestion
// set cpu frequency to 80mhz for sending
// do the sending


// enter light sleep
setCpuFrequencyMhz(20);


long left = 1000000 - (micros() - prev);
//Serial.println(left);
esp_sleep_enable_timer_wakeup(left);
esp_light_sleep_start();

// every few minutes send telemetry and synchronise time
}
}
