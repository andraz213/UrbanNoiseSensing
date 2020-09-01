#include "maintanence_routine.h"



const char* ssid = "A1";
const char* password = "siol2004";
const char* serverName = "http://urbannoisesensing.herokuapp.com/api/sensor/data";

HTTPClient http;

void do_maintanence() {

  // connect to WiFi

  // connect to server

  // get info

  // if firmware version is not the latest, go into ota handler

  // ota handler

  // send telemetry data every five minutes

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
