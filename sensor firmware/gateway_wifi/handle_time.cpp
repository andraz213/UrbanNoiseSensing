#include "handle_time.h"
#include "apps/sntp/sntp.h"
#include <sys/time.h>
//#include "esp_sntp.h"
#include <Arduino.h>

bool inited_time = false;

void init_time() {
  if(!inited_time){
    sntp_setoperatingmode(SNTP_OPMODE_POLL);
    sntp_setservername(0, "europe.pool.ntp.org");
    //sntp_set_sync_interval(60000);
    //sntp_set_time_sync_notification_cb(time_sync_notification_cb);
    sntp_init();
    inited_time = true;
  }

  //Serial.println(sntp_get_sync_interval());

}

int64_t get_us_time() {

  struct timeval tv_now;
  gettimeofday(&tv_now, NULL);
  int64_t time_us = (int64_t)tv_now.tv_sec * 1000000L + (int64_t)tv_now.tv_usec;
  if (time_us < 1596564101135794) {
    return -1;
  }
  return time_us;
}




void print_time() {

  struct timeval tv_now;
  struct timeval tv_now_30;
  gettimeofday(&tv_now, NULL);
  gettimeofday(&tv_now_30, NULL);
  int64_t time_us = (int64_t)tv_now.tv_sec * 1000000L + (int64_t)tv_now.tv_usec;

  int64_t time_us_30 = (int64_t)tv_now_30.tv_sec * 1000000L + (int64_t)tv_now_30.tv_usec;
  Serial.println("time:");
  Serial.println((long)time_us_30 - (long)time_us);




  time_t now;
  char strftime_buf[64];
  struct tm timeinfo;

  time(&now);
  // Set timezone to China Standard Time
  setenv("TZ", "UTC-2", 1);
  tzset();

  localtime_r(&now, &timeinfo);
  strftime(strftime_buf, sizeof(strftime_buf), "%c", &timeinfo);
  Serial.printf("The current date/time in Ljubljana is: %s", strftime_buf);

}
