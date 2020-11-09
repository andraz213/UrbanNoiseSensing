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

  init_mac_and_name();

  // setup wifi LR and espnow
  setup_wifi_and_LR();

  // init i2s
  init_i2s();

  // sync time
  printout_config();

  esp_wifi_start();
  sync_time_and_telemetry();
  esp_wifi_stop();

  // while true loop
  while (true) {
    int st = 0;
    while(get_usecs() > 900000){
      st++;
    }

    if(is_interval_now()){
      sensing_and_data_preparation();
    }

    // sleep for a random amount of time to prevent signal congestion
    setCpuFrequencyMhz(20);
    int random_sleep = (int)get_random_sleep_time();

    if (random_sleep > 0) {
      esp_sleep_enable_timer_wakeup(random_sleep);
      esp_light_sleep_start();
    }

    // set cpu frequency to 80mhz for sending
    setCpuFrequencyMhz(80);

    // send data and telemetry
    sending_and_telemetry();


    setCpuFrequencyMhz(10);
    long left = 0;
    left = get_remaining_sleep_time();

    // enter light sleep
    if (left > 0) {
      esp_sleep_enable_timer_wakeup(left);
      esp_light_sleep_start();
    }
  }
}

void init_mac_and_name(){
  get_gateway_mac(mac);
  name = get_config_name();
}


void printout_config(){
  oled_on();
  String battery = String(get_battery_voltage()) + "V";
  String mac_string = String(mac[0], HEX) + ":" + String(mac[1], HEX) + ":" + String(mac[2], HEX) + ":" + String(mac[3], HEX) + ":" + String(mac[4], HEX) + ":" +String(mac[5], HEX);
  print_text(String("UrbanNoiseSensing"), name, mac_string, battery);
  delay(5000);
  oled_off();
}



void sending_and_telemetry(){

  // do the sending
  send_data();
  sync_time_and_telemetry();


  while(!can_go_to_sleep_beacause_of_getting_time()){
    delay(1);
  }

  turn_off_wifi_for_esp_now();

}



void sensing_and_data_preparation(){
  print_usec();
  if(!digitalRead(27)){
    oled_on();
    draw_rect();
  }
  // set cpu frequency to 20mhz to lower the consumption
  setCpuFrequencyMhz(20);
  // get the sensor data
  sensing_start = get_secs();

  get_samples((int*)&samples_pub);
  oled_off();
  Serial.println((unsigned long) sensing_start);
  // set cpu frequency to 240mhz for processing
  setCpuFrequencyMhz(240);
  // process the data
  calculate_fft((int*)&samples_pub, (double*)&fft_downsampled, DOWNSAMPLED__FFT);
  decibels = 0.0;
  decibels = calculate_decibels((int*)&samples_pub, SAMPLES_SIZE);

  // put data into a sending queue
  add_to_sending_queue((double*) &fft_downsampled, decibels, sensing_start);

}
