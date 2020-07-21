#include <driver/i2s.h>
#include "arduinoFFT.h"
#include <ArduinoJson.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include "esp_wifi.h"
#include "driver/i2s.h"
#include <esp_pm.h>

const char* ssid = "A1";
const char* password = "siol2004";

//Your Domain name with URL path or IP address with path
const char* serverName = "http://urbannoisesensing.herokuapp.com/api/sensor/data";


HTTPClient http;

arduinoFFT FFT = arduinoFFT(); /* Create FFT object */
const i2s_port_t I2S_PORT = I2S_NUM_0;
int read_in [5120];
long start = 0;
const int SAMPLING_FREQUENCY = 44100;
const int BLOCK_SIZE = 128;//768;
const int SAMPLES_SIZE = 256;
int32_t samples[SAMPLES_SIZE];
double vReal[SAMPLES_SIZE];
double vImag[SAMPLES_SIZE];
long previous = 0;




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
    .dma_buf_count = 3,//6,                           // number of buffers
    .dma_buf_len = BLOCK_SIZE,                     // samples per buffe
  };

  // The pin config as per the setup
  const i2s_pin_config_t pin_config = {
    .bck_io_num = 12,   // BCKL
    .ws_io_num = 15,    // LRCL
    .data_out_num = -1, // not used (only for speakers)
    .data_in_num = 32   // DOUT
  };


  err = i2s_driver_install(I2S_PORT, &i2s_config, 0, NULL);
  if (err != ESP_OK) {
    Serial.printf("Failed installing driver: %d\n", err);
    while (true);
  }

  err = i2s_set_clk(I2S_PORT, 44100 * 10, I2S_BITS_PER_SAMPLE_32BIT, I2S_CHANNEL_MONO);
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
  //Serial.println(micros() - start);
  i2s_start(I2S_PORT);
  Serial.println(micros() - start);
  //init_i2s();
  Serial.println(micros() - start);


  i2s_set_clk(I2S_PORT, 44100, I2S_BITS_PER_SAMPLE_32BIT, I2S_CHANNEL_MONO);

  for (int i = 0; i < 50; i++) {
    int test[128];

    int num_bytes_read = i2s_read_bytes(I2S_PORT,
                                        (char *)test,
                                        512,     // the doc says bytes, but its elements.
                                        portMAX_DELAY); // no timeout

  }

  for (int i = 0; i < SAMPLES_SIZE; i++) {
    samples[i] = 0;
  }
  int read_non_zero = 0;
  int to_read = 3840 * 4; //512 * 40; //BLOCK_SIZE * 8;
  int elements_read = to_read / 4;
  const int downsample_ratio = 15;
  
  int to_downsample [downsample_ratio];
  int num_in_downsample = 0;
   //Serial.println(micros() - start);

  int read_packets = 0;
  while (read_non_zero < SAMPLES_SIZE) {
    for (int j = 0; j < elements_read; j++) {
      read_in[j] = 0;
    }


    int num_bytes_read = i2s_read_bytes(I2S_PORT,
                                        (char *)read_in,
                                        to_read,     // the doc says bytes, but its elements.
                                        portMAX_DELAY); // no timeout

    int num_elemtnts_read = num_bytes_read / 4;
    Serial.println("AAAAAAAAAAA----------------AAAAAAaa");
    Serial.println(num_bytes_read);
    Serial.println(read_non_zero);
    Serial.println((micros() - start) / 1000);

    if (num_bytes_read > 0 && micros() - start > 45000) {
      for (int i = 0; i < num_elemtnts_read; i++) {
        samples[read_non_zero % SAMPLES_SIZE] = 0;
        to_downsample[num_in_downsample] = (read_in[i] >> 8);
        num_in_downsample ++;

        if (num_in_downsample == downsample_ratio) {
          int sum = 0;
          for (int k = 0; k < downsample_ratio; k++) {
            sum += to_downsample[k];
            to_downsample[k] = 0;
          }
          samples[read_non_zero % SAMPLES_SIZE] = (int)(((float)sum) /downsample_ratio);

          num_in_downsample = 0;
          read_non_zero += 1;
          // read_non_zero %= 200;
        }
        /*if ((int)read_non_zero == SAMPLES_SIZE ) {
          break;
          }*/
      }

    }
  }


  i2s_stop(I2S_PORT);
  Serial.println("AAAAAAAAAAA----------------AAAAAAaa");
  int ddd = 0;
  for (int i = 0; i < SAMPLES_SIZE; ++i) {
    //Serial.println(i);
    ddd += samples[i % 256];
    if (i < 256) {
      //Serial.println(((double)samples[i % 256]));
    }
  }

  Serial.println((ddd >> 8));


}




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

  if (millis() - previous > 1000) {
    previous = millis();
    start = micros();
    getSamples();
    Serial.println("Getting samples lasted: ");
    //Serial.println(micros() - start);
    start = micros();
    analyzeData();
    Serial.println("Analyzing data lasted: ");
    //Serial.println(micros() - start);

    start = micros();
    String dataToSend = createJSON();
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



void analyzeData() {
  for (int i = 0; i < SAMPLES_SIZE; i++) {
    vReal[i] = (double)samples[i];
    vImag[i] = 0;
  }

  FFT.Windowing(vReal, SAMPLES_SIZE, FFT_WIN_TYP_HAMMING, FFT_FORWARD);  /* Weigh data */

  FFT.Compute(vReal, vImag, SAMPLES_SIZE, FFT_FORWARD); /* Compute FFT */

  FFT.ComplexToMagnitude(vReal, vImag, SAMPLES_SIZE); /* Compute magnitudes */

  double x = FFT.MajorPeak(vReal, SAMPLES_SIZE, SAMPLING_FREQUENCY);
  //Serial.println(x, 6);
}


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
