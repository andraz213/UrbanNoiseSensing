
#include <arduino.h>
#include "sensing_routine.h"
#include "decibel_calculator.h"

const i2s_port_t I2S_PORT = I2S_NUM_0;
int read_in [5120];
long start = 0;
const int SAMPLING_FREQUENCY = 44100;
const int BLOCK_SIZE = 128;//768;
const int SAMPLES_SIZE = 256;
int samples[SAMPLES_SIZE];
double vReal[SAMPLES_SIZE];
double vImag[SAMPLES_SIZE];



void setup_wifi_and_LR(){}



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


void sync_time_send_telemetry(){}


void getSamples() {
  //Serial.println(micros() - start);

  /* pinMode(26, INPUT);
    pinMode(27, INPUT);
    delay(2);
  */
  pinMode(26, OUTPUT);
  pinMode(27, OUTPUT);
  digitalWrite(27, HIGH);
  digitalWrite(26, LOW);

  i2s_start(I2S_PORT);
  Serial.println(micros() - start);
  //init_i2s();
  Serial.println(micros() - start);


  i2s_set_clk(I2S_PORT, 44100, I2S_BITS_PER_SAMPLE_32BIT, I2S_CHANNEL_MONO);

  for (int i = 0; i < 160; i++) {
    int test[128];

    int num_bytes_read = i2s_read_bytes(I2S_PORT,
                                        (char *)test,
                                        512,     // the doc says bytes, but its elements.
                                        portMAX_DELAY); // no timeout

    if ( i > 60) {
      int sum = 0;

      if (i % 10 == 0) {
        Serial.println(50000000);
        Serial.println((micros() - start) / 1000);
        Serial.println(-50000000);
      }

      for (int j = 0; j < 8; j++) {
        sum = 0;
        sum += test[j * 16] >> 4;
        sum += test[j * 16 + 1] >> 4;
        sum += test[j * 16 + 2] >> 4;
        sum += test[j * 16 + 3] >> 4;
        sum += test[j * 16 + 4] >> 4;
        sum += test[j * 16 + 5] >> 4;
        sum += test[j * 16 + 6] >> 4;
        sum += test[j * 16 + 7] >> 4;
        sum += test[j * 16 + 8] >> 4;
        sum += test[j * 16 + 9] >> 4;
        sum += test[j * 16 + 10] >> 4;
        sum += test[j * 16 + 11] >> 4;
        sum += test[j * 16 + 12] >> 4;
        sum += test[j * 16 + 13] >> 4;
        sum += test[j * 16 + 14] >> 4;
        sum += test[j * 16 + 15] >> 4;
        Serial.println(sum);
      }


      //Serial.println(sum >> 7);
      Serial.println(sum);
    }
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
          samples[read_non_zero % SAMPLES_SIZE] = (int)(((float)sum) / downsample_ratio);

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
  /* pinMode(26, INPUT);
    pinMode(27, INPUT);*/
  Serial.println("AAAAAAAAAAA----------------AAAAAAaa");
  int ddd = 0;
  for (int i = 0; i < SAMPLES_SIZE; ++i) {
    //Serial.println(i);
    ddd += samples[i % 256];
    if (i < 256) {
      //Serial.println(((double)samples[i % 256]));
    }
  }

  Serial.println(calculate_decibels((int*)&samples, 256));
  Serial.println((ddd >> 8));


}

void do_fft(){}

void do_decibels(){}

void send_data(){}





void do_sensing(){

// setup wifi LR and espnow


// init i2s

// sync time



// while true loop


// get the sensor data


// process the data

// do the sending


// sleep


// every few minutes send telemetry and synchronise time

}
