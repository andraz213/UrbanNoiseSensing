#include "microphone.h"
#include <arduino.h>
#include "driver/i2s.h"



long start = 0;






void init_i2s() {
  esp_err_t err;

  // The I2S config as per the example
  const i2s_config_t i2s_config = {
    .mode = i2s_mode_t(I2S_MODE_MASTER | I2S_MODE_RX), // Receive, not transfer
    .sample_rate = SAMPLING_FREQUENCY,
    .bits_per_sample = I2S_BITS_PER_SAMPLE_32BIT, // could only get it to work with 32bits
    .channel_format = I2S_CHANNEL_FMT_ONLY_RIGHT, // although the SEL config should be left, it seems to transmit on right
    .communication_format = i2s_comm_format_t(I2S_COMM_FORMAT_I2S | I2S_COMM_FORMAT_I2S_MSB),
    .intr_alloc_flags = ESP_INTR_FLAG_LEVEL1,     // Interrupt level 1
    .dma_buf_count = 3,//6,                           // number of buffers
    .dma_buf_len = BLOCK_SIZE,                     // samples per buffe
    .use_apll = true
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


  err = i2s_set_pin(I2S_PORT, &pin_config);
  if (err != ESP_OK) {
    Serial.printf("Failed setting pin: %d\n", err);
    while (true);
  }
  Serial.println("I2S driver installed.");

}



int test[128];
const int to_read = 3840 * 4;
const int elements_read = 3840;
const int downsample_ratio = 15;
int read_in [elements_read];
int to_downsample [downsample_ratio];


void get_samples(int * samples) {




  i2s_start(I2S_PORT);


  // wait for microphone to fully initialize
  for (int i = 0; i < 50; i++) {
    int num_bytes_read = i2s_read_bytes(I2S_PORT,
                                        (char *)test,
                                        512,     // the doc says bytes, but its elements.
                                        portMAX_DELAY); // no timeout

  }

  int read_non_zero = 0;
  int num_in_downsample = 0;
  int read_packets = 0;

  // initialize samples values
  for (int i = 0; i < SAMPLES_SIZE; i++) {
    samples[i] = 0;
  }


  while (read_non_zero < SAMPLES_SIZE) {
    for (int j = 0; j < elements_read; j++) {
      read_in[j] = 0;
    }


    int num_bytes_read = i2s_read_bytes(I2S_PORT,
                                        (char *)read_in,
                                        to_read,     // the doc says bytes, but its elements.
                                        portMAX_DELAY); // no timeout

    int num_elemtnts_read = num_bytes_read / 4;

    if (num_bytes_read > 0) {
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
          samples[read_non_zero % SAMPLES_SIZE] = (int)(((float)sum) / (float)downsample_ratio);

          num_in_downsample = 0;
          read_non_zero += 1;
        }
      }
    }
  }

  i2s_stop(I2S_PORT);

}
