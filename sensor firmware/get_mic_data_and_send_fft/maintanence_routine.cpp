#include "maintanence_routine.h"
#include "handle_wifi.h"
#include "handle_oled.h"
#include <ArduinoJson.h>
#include "global_defines.h"
#include "sensing_routine.h"
#include "microphone.h"
#include "spectrum_analysis.h"
#include "decibel_calculator.h"
#include "common.h"



const char* ssid = "UNSwifi";
const char* password = "uns12wifi34";
const char* serverName = "http://urbannoisesensing.biolab.si";

HTTPClient http;

void do_maintanence() {

  setCpuFrequencyMhz(80);

  while (true) {
    connect_and_get_data();
    do_sensing_for_test();
    connect_and_send_telemetry();





    // get info

    // if firmware version is not the latest, go into ota handler

    // ota handler

    // send telemetry data every five minutes


  }

}

long previous_got_data = -30000;
void connect_and_get_data() {
  if (millis() - previous_got_data > 60000) {
    print_text(String("Connecting to:"), String(ssid), String(""), String(""));
    connect_wifi(ssid, password);
    print_text(String("Connected!"), String("Getting sensor config"), String(""), String(""));
    if (say_hi_get_config(serverName)) {
      previous_got_data = millis();
      uint8_t * mmm = (uint8_t *)heap_caps_malloc(sizeof(uint8_t) * 6, MALLOC_CAP_8BIT);
      get_gateway_mac(mmm);
      String name = get_config_name();
      String mac = String(mmm[0], HEX) + ":" + String(mmm[1], HEX) + ":" + String(mmm[2], HEX) + ":" + String(mmm[3], HEX) + ":" + String(mmm[4], HEX) + ":" +String(mmm[5], HEX);
      print_text(name, String("Gateway MAC"), mac, String(millis()));
      delay(5000);

    }
    else {
      previous_got_data += 10000;
    }
  }
}

long previous_sensing = 0;
void do_sensing_for_test() {
  if (millis() - previous_sensing > 500) {
    previous_sensing = millis();
    int samples_pubb[SAMPLES_SIZE];
    double fft_downsampledd[DOWNSAMPLED__FFT];
    double decibels = 0.0;

    init_i2s();
    get_samples((int*)&samples_pubb);
    double max_freq = calculate_fft((int*)&samples_pubb, (double*)&fft_downsampledd, DOWNSAMPLED__FFT);
    decibels = 0.0;
    decibels = calculate_decibels((int*)&samples_pubb, SAMPLES_SIZE);

    show_spectrogram(DOWNSAMPLED__FFT, (double *)fft_downsampledd, decibels, max_freq, get_config_name());
  }
}


long previous_send_telemetry = -120000;
void connect_and_send_telemetry() {
  if (millis() - previous_send_telemetry > 120000) {
    print_text(String("Connecting to:"), String(ssid), String(""), String(""));
    connect_wifi(ssid, password);
    print_text(String("Connected!"), String("Sending telemetry data"), String(""), String(""));

    String version = String("testna verzija");
    double battery_voltage = get_battery_voltage();

    if (post_telemetry(serverName, version, battery_voltage)) {
      previous_send_telemetry = millis();
    }
    else {
      previous_send_telemetry += 10000;
    }
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
