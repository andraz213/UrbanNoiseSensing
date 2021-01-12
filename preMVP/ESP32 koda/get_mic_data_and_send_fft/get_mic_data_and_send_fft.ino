#include <driver/i2s.h>
#include "arduinoFFT.h"
#include <ArduinoJson.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include "esp_wifi.h"

const char* ssid = "";
const char* password = "";

//Your Domain name with URL path or IP address with path
const char* serverName = "http://noise-sensing-pre-mvp.herokuapp.com/api/measurements";


arduinoFFT FFT = arduinoFFT(); /* Create FFT object */
const i2s_port_t I2S_PORT = I2S_NUM_0;

const int SAMPLING_FREQUENCY = 3000;
const int BLOCK_SIZE = 256;
int32_t samples[BLOCK_SIZE];
double vReal[BLOCK_SIZE];
double vImag[BLOCK_SIZE];
long previous = 0;

void setup() {
  Serial.begin(115200);
  Serial.println("Configuring I2S...");
  init_i2s();
  connectWifi();
  // Configuring the I2S driver and pins.
  // This function must be called before any I2S driver read/write operations.

}

void loop() {

  if (millis() - previous > 1000) {
    previous = millis(); 
    long start = micros();
    getSamples();
    Serial.println("Getting samples lasted: ");
    Serial.println(micros()- start);

    start = micros();
    analyzeData();
    Serial.println("Analyzing data lasted: ");
    Serial.println(micros()- start);

    start = micros();
    String dataToSend = createJSON();
    Serial.println("Creating JSON lasted: ");
    Serial.println(micros()- start);

    
    start = micros();
    connectWifi();
    Serial.println("Connecting to WiFi lasted: ");
    Serial.println(micros()- start);
    

    start = micros();
    sendDataToServer(dataToSend);
    Serial.println("Sending data lasted: ");
    Serial.println(micros()- start);
    Serial.println();
    Serial.println();
  }
  delay(10);
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

void init_i2s() {
  esp_err_t err;

  // The I2S config as per the example
  const i2s_config_t i2s_config = {
    .mode = i2s_mode_t(I2S_MODE_MASTER | I2S_MODE_RX), // Receive, not transfer
    .sample_rate = SAMPLING_FREQUENCY,                 // 16KHz
    .bits_per_sample = I2S_BITS_PER_SAMPLE_32BIT, // could only get it to work with 32bits
    .channel_format = I2S_CHANNEL_FMT_ONLY_RIGHT, // although the SEL config should be left, it seems to transmit on right
    .communication_format = i2s_comm_format_t(I2S_COMM_FORMAT_I2S | I2S_COMM_FORMAT_I2S_MSB),
    .intr_alloc_flags = ESP_INTR_FLAG_LEVEL1,     // Interrupt level 1
    .dma_buf_count = 4,                           // number of buffers
    .dma_buf_len = BLOCK_SIZE                     // samples per buffer
  };

  // The pin config as per the setup
  const i2s_pin_config_t pin_config = {
    .bck_io_num = 14,   // BCKL
    .ws_io_num = 15,    // LRCL
    .data_out_num = -1, // not used (only for speakers)
    .data_in_num = 32   // DOUT
  };


  err = i2s_driver_install(I2S_PORT, &i2s_config, 0, NULL);
  if (err != ESP_OK) {
    Serial.printf("Failed installing driver: %d\n", err);
    while (true);
  }
  err = i2s_set_pin(I2S_PORT, &pin_config);
  if (err != ESP_OK) {
    Serial.printf("Failed setting pin: %d\n", err);
    while (true);
  }
  Serial.println("I2S driver installed.");

}


void getSamples() {




  for (int i = 0; i < BLOCK_SIZE; i++) {
    samples[i] = 0;
  }
  delay(120);
  int num_bytes_read = i2s_read_bytes(I2S_PORT,
                                      (char *)samples,
                                      BLOCK_SIZE * 4,     // the doc says bytes, but its elements.
                                      portMAX_DELAY); // no timeout
  delay(120);
  num_bytes_read = i2s_read_bytes(I2S_PORT,
                                  (char *)samples,
                                  BLOCK_SIZE * 4,     // the doc says bytes, but its elements.
                                  portMAX_DELAY); // no timeout

  int samples_read = num_bytes_read;
  //Serial.println(samples_read);

  if (samples_read > 0) {

    float mean = 0;
    for (int i = 0; i < BLOCK_SIZE; ++i) {
      mean += abs(samples[i] / (float)BLOCK_SIZE);
      //Serial.println(samples[i]);
    }
    //Serial.println(mean);
  }



  //i2s_driver_uninstall(I2S_NUM_0);


}



void analyzeData() {
  for (int i = 0; i < BLOCK_SIZE; i++) {
    vReal[i] = (double)samples[i];
    vImag[i] = 0;
  }

  FFT.Windowing(vReal, BLOCK_SIZE, FFT_WIN_TYP_HAMMING, FFT_FORWARD);  /* Weigh data */

  FFT.Compute(vReal, vImag, BLOCK_SIZE, FFT_FORWARD); /* Compute FFT */

  FFT.ComplexToMagnitude(vReal, vImag, BLOCK_SIZE); /* Compute magnitudes */

  double x = FFT.MajorPeak(vReal, BLOCK_SIZE, SAMPLING_FREQUENCY);
  Serial.println(x, 6);

}


String createJSON() {
  StaticJsonDocument<2000> doc;
  doc["sensor"] = "prvi testni senzor";
  JsonArray location = doc.createNestedArray("location");

  location.add(46.181334);
  location.add(14.494998);


  JsonArray fftValues = doc.createNestedArray("fftValues");
  //JsonArray fftFrequencies = doc.createNestedArray("fftFrequencies");

  for (int i = 0; i < BLOCK_SIZE / 20; i++) {
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
  for (int i = 0; i < BLOCK_SIZE; i++) {
    decibels += (int)(abs(samples[i]) / BLOCK_SIZE);
  }
  doc["decibels"] = decibels;
  String jsn;
  serializeJson(doc, jsn);
  //Serial.println(jsn);

  return jsn;
  //serializeJsonPretty(doc, Serial);



}






void sendDataToServer(String jsnData) {
  HTTPClient http;
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
