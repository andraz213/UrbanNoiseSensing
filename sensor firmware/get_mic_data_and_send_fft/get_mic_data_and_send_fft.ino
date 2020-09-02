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
#include <driver/adc.h>


bool mode = true;


void setup() {
  adc1_config_width(ADC_WIDTH_12Bit);
  adc1_config_channel_atten(ADC1_CHANNEL_0, ADC_ATTEN_0db); //set reference voltage to internal
  Serial.begin(115200);

  pinMode(27, INPUT_PULLUP);
  delay(20);
  mode = digitalRead(27);

}


void loop() {

  if(mode){
    do_sensing();
  }
  if(!mode){
    do_maintanence();
  }

  delay(1);
}
