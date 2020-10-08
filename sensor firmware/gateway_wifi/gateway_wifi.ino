
#include "handle_oled.h"
#include "handle_wifi.h"
#include "handle_serial.h"

long last_wifi = 0;

void setup() {
  // put your setup code here, to run once:

  Serial.begin(115200);
  Serial2.begin(921600);
  Serial2.setRxBufferSize(1024);

  setCpuFrequencyMhz(240);

  // init two tasks



  init_wifi();



  // task two
  xTaskCreatePinnedToCore(
    TaskSerial
    ,  "TaskSerial"
    ,  32000  // Stack size
    ,  NULL
    ,  1  // Priority
    ,  NULL
    ,  1);

  // task one
  xTaskCreatePinnedToCore(
    TaskWifi
    ,  "TaskWifi"
    ,  32000  // Stack size
    ,  NULL
    ,  1  // Priority
    ,  NULL
    ,  0);



}
long prev_display = 0;

void loop() {
  // put your main code here, to run repeatedly:
  if(millis() - last_wifi >  5000){
    init_wifi();
    last_wifi = millis();
  }

  int rtt_avg = get_RTT_average();
  int rtt_num = get_sent_in_last_second();
  if(millis() - prev_display > 333){
    prev_display = millis();
    print_text(String("Previous second:"), String(rtt_num), String("Average RTT: "), String(rtt_avg));
    delay(10);
  }

}
