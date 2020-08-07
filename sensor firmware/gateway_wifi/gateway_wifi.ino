
#include "handle_wifi.h"
#include "handle_serial.h"

long last_wifi = 0;

void setup() {
  // put your setup code here, to run once:

  Serial.begin(115200);
  Serial2.begin(921600);
  Serial2.setRxBufferSize(1024);

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
    TaskEspNow
    ,  "TaskEspNow"
    ,  32000  // Stack size
    ,  NULL
    ,  1  // Priority
    ,  NULL
    ,  0);



}

void loop() {
  // put your main code here, to run repeatedly:
  if(millis() - last_wifi >  5000){
    init_wifi();
    last_wifi = millis();
  }

}
