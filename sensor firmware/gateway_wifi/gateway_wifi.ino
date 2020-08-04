
#include "handle_wifi.h"
#include "handle_serial.h"


void setup() {
  // put your setup code here, to run once:

  Serial.begin(115200);
  Serial2.begin(115200);
  init_wifi();

  // init two tasks


/*
  // task one
  xTaskCreatePinnedToCore(
  TaskEspNow
  ,  "TaskEspNow"
  ,  32000  // Stack size
  ,  NULL
  ,  1  // Priority
  ,  NULL
  ,  0);*/


  // task two
  xTaskCreatePinnedToCore(
  TaskSerial
  ,  "TaskSerial"
  ,  32000  // Stack size
  ,  NULL
  ,  1  // Priority
  ,  NULL
  ,  1);




}

void loop() {
  // put your main code here, to run repeatedly:

}
