
#include "handle_esp_now.h"
#include "handle_serial.h"


void setup() {

  pinMode(33, INPUT);
  // put your setup code here, to run once:

  Serial.begin(115200);
  Serial2.begin(921600);
  Serial2.setRxBufferSize(1024);

  setCpuFrequencyMhz(240);

  init_wifi();

  // init two tasks



  // task one
  xTaskCreatePinnedToCore(
    TaskEspNow
    ,  "TaskEspNow"
    ,  32000  // Stack size
    ,  NULL
    ,  1  // Priority
    ,  NULL
    ,  0);


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
