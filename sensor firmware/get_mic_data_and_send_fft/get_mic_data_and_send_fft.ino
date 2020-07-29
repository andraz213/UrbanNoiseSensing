#include "arduinoFFT.h"
#include <ArduinoJson.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include "esp_wifi.h"
#include <esp_pm.h>
#include "sensing_routine.h"

const char* ssid = "A1";
const char* password = "siol2004";

//Your Domain name with URL path or IP address with path
const char* serverName = "http://urbannoisesensing.herokuapp.com/api/sensor/data";


HTTPClient http;

arduinoFFT FFT = arduinoFFT(); /* Create FFT object */



long previous = 0;



void setup() {
  Serial.begin(115200);
  Serial.println("Configuring I2S...");
  init_i2s();
  //connectWifi();
  // Configuring the I2S driver and pins.
  // This function must be called before any I2S driver read/write operations.

  // Now the task scheduler, which takes over control of scheduling individual tasks, is automatically started.
}





void loop() {
  setCpuFrequencyMhz(240);
  long start = 0;

  if (millis() - previous > 1000) {
    previous = millis();
    start = micros();
    getSamples();
    Serial.println("Getting samples lasted: ");
    //Serial.println(micros() - start);
    start = micros();
    //analyzeData();
    Serial.println("Analyzing data lasted: ");
    //Serial.println(micros() - start);

    start = micros();
    //String dataToSend = createJSON();
    Serial.println("Creating JSON lasted: ");
    //Serial.println(micros() - start);

    /*
        start = micros();
        connectWifi();
        Serial.println("Connecting to WiFi lasted: ");
        Serial.println(micros() - start);


        start = micros();
        sendDataToServer(dataToSend);
        Serial.println("Sending data lasted: ");
        Serial.println(micros() - start);
        Serial.println();
        Serial.println();
    */
    //esp_wifi_stop();
    Serial.println("Creating JSON lasted: ");
    esp_sleep_enable_timer_wakeup(2000000);
    Serial.println("Creating JSON lasted: ");
    esp_light_sleep_start();
    Serial.println("Creating JSON lasted: ");
    esp_wifi_start();
    Serial.println("Creating JSON lasted: ");
  }

  delay(1);
}


void connectWifi() {

  if (WiFi.status() != WL_CONNECTED) {
    WiFi.begin(ssid, password);
    Serial.println("Connecting");
    while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(".");
    }
    //esp_wifi_set_ps(WIFI_PS_MAX_MODEM);
  }


}


/*
void analyzeData() {
  for (int i = 0; i < SAMPLES_SIZE; i++) {
    vReal[i] = (double)samples[i];
    vImag[i] = 0;
  }

  FFT.Windowing(vReal, SAMPLES_SIZE, FFT_WIN_TYP_HAMMING, FFT_FORWARD);

  FFT.Compute(vReal, vImag, SAMPLES_SIZE, FFT_FORWARD);

  FFT.ComplexToMagnitude(vReal, vImag, SAMPLES_SIZE);

  double x = FFT.MajorPeak(vReal, SAMPLES_SIZE, SAMPLING_FREQUENCY);
  //Serial.println(x, 6);
}

*/

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


void RealLoop(void *pvParameters) {
  for (;;) {


  }
}
