#include "maintanence_routine.h"
#include "handle_wifi.h"
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <ArduinoJson.h>
#include "global_defines.h"
#include "sensing_routine.h"
#include "microphone.h"
#include "spectrum_analysis.h"
#include "decibel_calculator.h"

Adafruit_SSD1306 display(128, 32, &Wire, -1);

const char* ssid = "PSP256";
const char* password = "siol2004";
const char* serverName = "http://urbannoisesensing.herokuapp.com";

HTTPClient http;

void do_maintanence() {
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  display.display();
  display.clearDisplay();

  display.setTextSize(1);      // Normal 1:1 pixel scale
  display.setTextColor(SSD1306_WHITE); // Draw white text
  display.setCursor(0, 0);

  display.println("Connecting to:");

  display.println(ssid);

  display.display();


  // connect to WiFi

  connect_wifi(ssid, password);
  display.clearDisplay();
  display.clearDisplay();
  display.setTextSize(1);      // Normal 1:1 pixel scale
  display.setTextColor(SSD1306_WHITE); // Draw white text
  display.setCursor(0, 0);
  display.println("Connected!");
  display.println("Getting sensor config");


  display.display();
  // connect to server

  while(!say_hi_get_config(serverName)){
    delay(1000);
    connect_wifi(ssid, password);
  }

  double average = 0.0;
  long prev = millis();
  while(true){
  String name = get_config_name();
  display.clearDisplay();
  display.setTextSize(1);      // Normal 1:1 pixel scale
  display.setTextColor(SSD1306_WHITE); // Draw white text
  display.setCursor(0, 0);
  display.println(name);


  // get info

  // if firmware version is not the latest, go into ota handler

  // ota handler

  // send telemetry data every five minutes
  int samples_pubb[SAMPLES_SIZE];
  double fft_downsampledd[DOWNSAMPLED__FFT];
  double decibels = 0.0;
  init_i2s();
  get_samples((int*)&samples_pubb);
  double max_freq = calculate_fft((int*)&samples_pubb, (double*)&fft_downsampledd, DOWNSAMPLED__FFT);
  decibels = 0.0;
  decibels = calculate_decibels((int*)&samples_pubb, SAMPLES_SIZE);
  display.println(decibels);
  display.println(max_freq);


  double max_fft = 0.0;
  for(int i = 0; i<DOWNSAMPLED__FFT; i++){
    if(fft_downsampledd[i] > max_fft){
      max_fft = fft_downsampledd[i];
    }
  }

  if(max_fft > average){
    average = max_fft;
  } else {
    average *= 0.9;
    max_fft += 0.1;
  }




for(int i = 0; i<DOWNSAMPLED__FFT; i++){
  int height = map(fft_downsampledd[i], 0, (int)average, 0, 28);
  display.drawLine(i*2 + 74, 31, i*2 + 74, 31 - height, SSD1306_WHITE);

}

  display.println(average);
  display.display();
  while(millis() - prev < 99){
    delay(1);
  }
  prev = millis();

}

}





void sendDataToServer(String jsnData) {

  http.begin(serverName);


  // Specify content-type header
  http.addHeader("Content-Type", "application/json");
  // Data to send with HTTP POST
  String httpRequestData = jsnData;
  // Send HTTP POST request
  int httpResponseCode = http.POST(httpRequestData);

  Serial.print("HTTP Response code: ");
  Serial.println(httpResponseCode);

  // Free resources
  http.end();
}



/*

String createJSON() {
StaticJsonDocument<2000> doc;
doc["sensor"] = "prvi testni senzor";
JsonArray mac = doc.createNestedArray("mac");


mac.add(12);
mac.add(34);
mac.add(23);
mac.add(3);
mac.add(23);


//doc["mac"] = [12,34,23,3,23];
JsonObject dataObj = doc.createNestedObject("data");

dataObj["frequencyRange"] = 1500;
dataObj["decibels"] = 23.1;



JsonArray fftValues = dataObj.createNestedArray("fftValues");
//JsonArray fftFrequencies = doc.createNestedArray("fftFrequencies");

for (int i = 0; i < SAMPLES_SIZE / 20; i++) {
  double val = 0;
  double freq = 0;

  for (int j = 0; j < 10; j++) {
    val += vReal[i * 10 + j] / 10.0;
    freq += (i * 10 + j);
  }
  fftValues.add(log(val));
  //fftFrequencies.add(freq * SAMPLING_FREQUENCY / 10000);


}

int decibels = 0;
for (int i = 0; i < SAMPLES_SIZE; i++) {
  decibels += (int)(abs(samples[i]) / SAMPLES_SIZE);
}
dataObj["decibels"] = decibels;
String jsn;
serializeJson(doc, jsn);

String to_Send = "[" + jsn + "]";
//Serial.println(to_Send);

return to_Send;
//serializeJsonPretty(doc, Serial);



}



*/
