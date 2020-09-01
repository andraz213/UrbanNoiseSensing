#include "FS.h"
#include "SPIFFS.h"
#include "global_defines.h"
#include <esp_pm.h>
#include "sensing_routine.h"
#include "maintanence_routine.h"
#include "microphone.h"
#include "spectrum_analysis.h"
#include "decibel_calculator.h"
#include "global_defines.h"




void setup() {

  Serial.begin(115200);

}


void loop() {

  //do_sensing();

  do_maintanence();

  delay(1);
}
