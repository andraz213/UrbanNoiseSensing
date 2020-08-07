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


int samples_pub[SAMPLES_SIZE];
unsigned int sensing_start = 0;

double fft_downsampled[DOWNSAMPLED__FFT];
double decibels = 0.0;

void sync_time_send_telemetry() {}

void do_sensing() {


  // setup wifi LR and espnow
  setup_wifi_and_LR();

  // init i2s
  init_i2s();

  // sync time

  esp_wifi_start();
  sync_time_and_telemetry();
  esp_wifi_stop();




  // while true loop
  int nummber_of_iteeer = 0;
  while (true) {
    print_usec();
    Serial.println(millis());
    Serial.println(heap_caps_get_free_size(MALLOC_CAP_8BIT));

    // set cpu frequency to 20mhz to lower the consumption
    setCpuFrequencyMhz(20);
    // get the sensor data
    sensing_start = get_secs();

    get_samples((int*)&samples_pub);

    Serial.println((unsigned long) sensing_start);
    // set cpu frequency to 240mhz for processing
    setCpuFrequencyMhz(240);
    // process the data
    calculate_fft((int*)&samples_pub, (double*)&fft_downsampled, DOWNSAMPLED__FFT);
    decibels = 0.0;
    decibels = calculate_decibels((int*)&samples_pub, SAMPLES_SIZE);

    // put data into a sending queue
    add_to_sending_queue((double*) &fft_downsampled, decibels, sensing_start);




    // sleep for a random amount of time to prevent signal congestion
    setCpuFrequencyMhz(20);
    int random_sleep = (int)get_random_sleep_time();


    if (random_sleep > 0) {
      esp_sleep_enable_timer_wakeup(random_sleep);
      esp_light_sleep_start();
    }



    // set cpu frequency to 80mhz for sending
    setCpuFrequencyMhz(80);

    // do the sending
    esp_wifi_start();
    sync_time_and_telemetry();
    send_data();

    esp_wifi_stop();


    // enter light sleep
    setCpuFrequencyMhz(10);

    long left = 0;

    left = get_remaining_sleep_time();

    if (left > 0) {
      esp_sleep_enable_timer_wakeup(left);
      esp_light_sleep_start();
    }


    // every few minutes send telemetry and synchronise time
  }
}
