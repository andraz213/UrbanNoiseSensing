
#include "common.h"
#include <driver/adc.h>
#include <Arduino.h>

double get_battery_voltage(){
  adc1_config_width(ADC_WIDTH_12Bit);
  adc1_config_channel_atten(ADC1_CHANNEL_0, ADC_ATTEN_0db); //set reference voltage to internal

  double sum = 0.0;
  double voltage = 0.0;

  float R1 = 20.0;
  float R2 = 5.0;

  int num = 10;

  for (int i = 0; i < num; i++)
  {
      sum += (double) adc1_get_voltage(ADC1_CHANNEL_0);
      delayMicroseconds(1);
  }
  // calculate the voltage
  voltage = sum / (float)num;
  voltage = (voltage * 1.1) / 4096.0; //for internal 1.1v reference
  // use if added divider circuit
  voltage = voltage / (R2/(R1+R2));

  Serial.print("voltage: ");
  Serial.println(voltage, 2);

  return voltage;
}
