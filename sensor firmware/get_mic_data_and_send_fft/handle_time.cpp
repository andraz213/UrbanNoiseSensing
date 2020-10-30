#include "handle_time.h"
#include "global_defines.h"
#include <Arduino.h>
#include <esp_wifi.h>
#include <esp_wifi_types.h>
#include <esp_now.h>
#include <WiFi.h>
#include "apps/sntp/sntp.h"
#include <sys/time.h>
#include "common.h"
#include "handle_json.h"
#include "sending.h"

long previous_time_sync = 0;
bool got_time = false;

int sensing_interval = 1;

long previous_sending_sec = 0;

long start_getting_time = 0;

long whole_time = 0;

void sync_time_and_telemetry() {

  got_time = false;

  if (previous_time_sync == 0 || millis() - previous_time_sync > 4000) {
    turn_on_wifi_for_esp_now();

    whole_time = millis();

    telemetry_message to_send;
    to_send.message_type = SENOSR_TELEMETRY;
    to_send.battery_voltage = get_battery_voltage();
    uint8_t mac_address [6];
    get_gateway_mac(mac_address);
    esp_err_t result = esp_now_send(mac_address, (uint8_t *) &to_send, sizeof(telemetry_message));

    start_getting_time = millis();

    previous_time_sync = millis() - 1000;
    if (got_time) {
      previous_time_sync = millis();
    }
  }
}


bool can_go_to_sleep_beacause_of_getting_time(){
  if(!got_time && millis() - start_getting_time < 100){
    return false;
  }

  return true;

}



void print_usec() {
  struct timeval tv_now;
  gettimeofday(&tv_now, NULL);
  long usec_now = (long)tv_now.tv_usec;
  Serial.print("                      ");
  Serial.println(usec_now);
}


unsigned int get_secs() {
  struct timeval tv_now;
  gettimeofday(&tv_now, NULL);
  unsigned int sec_now = (unsigned int)tv_now.tv_sec;
  return sec_now;
}

bool is_interval_now(){
  unsigned int secs = get_secs();
  if(secs % get_interval() == 0){
    return true;
  }
  return false;

}

unsigned int get_usecs() {
  struct timeval tv_now;
  gettimeofday(&tv_now, NULL);
  unsigned int sec_now = (unsigned int)tv_now.tv_usec;
  return sec_now;
}

long get_random_sleep_time() {
  struct timeval tv_now;
  gettimeofday(&tv_now, NULL);
  long sec_now = (long)tv_now.tv_sec;
  long usec_now = (long)tv_now.tv_usec;
  long res = 0;

  if (sec_now - previous_sending_sec < 2) {
    long left = 1000000 - usec_now;
    res = (long)random(left - 170000);
  }
  previous_sending_sec = sec_now;
  return res;
}


long get_remaining_sleep_time() {
  struct timeval tv_now;
  gettimeofday(&tv_now, NULL);
  long sec_now = (long)tv_now.tv_sec;
  long usec_now = (long)tv_now.tv_usec;
  long res = 0;

  if (previous_sending_sec == sec_now) {
    res = 1000000 - usec_now;
  }
  previous_sending_sec = sec_now;
  return res;
}



void handle_gateway_time(char *payload, int length) {
  got_time = true;
  previous_time_sync = millis();
  int64_t time_us;
  memcpy(&time_us, (char*)(payload + sizeof(int)), sizeof(int64_t));
  memcpy(&sensing_interval, (char*)(payload + sizeof(int) + sizeof(int64_t)), sizeof(int));
  if(sensing_interval < 1){
    sensing_interval = 1;
  }

  // ugly, but it works
  time_t      tv_sec = (time_t)0;
  suseconds_t tv_usec = (suseconds_t)0;

  int fact = 1;
  for (int i = 0; i < 6; i++) {
    tv_usec += (time_us % 10) * fact;
    time_us -= time_us % 10;
    time_us /= 10;
    fact *= 10;
  }

  fact = 1;
  while (time_us) {
    tv_sec += (time_us % 10) * fact;
    time_us -= time_us % 10;
    time_us /= 10;
    fact *= 10;
  }

  struct timeval tv = { .tv_sec = tv_sec, .tv_usec = tv_usec };
  settimeofday(&tv, NULL);
  Serial.println((int)tv_sec);
}


int get_interval(){
  if(sensing_interval < 1){
    return 1;
  }
  return sensing_interval;
}
