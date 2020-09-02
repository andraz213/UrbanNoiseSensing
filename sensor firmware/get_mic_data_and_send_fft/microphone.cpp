#include "global_defines.h"
#include "microphone.h"
#include <arduino.h>
#include "driver/i2s.h"
#include "soc/rtc.h"



#define APLL_MIN_FREQ (250000000)
#define APLL_MAX_FREQ (500000000)

long start = 0;

static float i2s_apll_get_fi2s(int bits_per_sample, int sdm0, int sdm1, int sdm2, int odir)
{
  int f_xtal = (int)rtc_clk_xtal_freq_get() * 1000000;

  float fout = f_xtal * (sdm2 + sdm1 / 256.0f + sdm0 / 65536.0f + 4);
  if (fout < APLL_MIN_FREQ || fout > APLL_MAX_FREQ) {
    return APLL_MAX_FREQ;
  }
  float fpll = fout / (2 * (odir + 2)); //== fi2s (N=1, b=0, a=1)
  return fpll / 2;
}


static esp_err_t i2s_apll_calculate_fi2s(int rate, int bits_per_sample, int *sdm0, int *sdm1, int *sdm2, int *odir)
{
  int _odir, _sdm0, _sdm1, _sdm2;
  float avg;
  float min_rate, max_rate, min_diff;
  if (rate / bits_per_sample / 2 / 8 < 10675) {
    return ESP_ERR_INVALID_ARG;
  }

  *sdm0 = 0;
  *sdm1 = 0;
  *sdm2 = 0;
  *odir = 0;
  min_diff = APLL_MAX_FREQ;

  // Roughly calculate coarse values

  for (_sdm2 = 4; _sdm2 < 9; _sdm2 ++) {
    max_rate = i2s_apll_get_fi2s(bits_per_sample, 255, 255, _sdm2, 0);
    min_rate = i2s_apll_get_fi2s(bits_per_sample, 0, 0, _sdm2, 31);
    avg = (max_rate + min_rate) / 2;
    if (abs(avg - rate) < min_diff) {
      min_diff = abs(avg - rate);
      *sdm2 = _sdm2;
    }
  }

  min_diff = APLL_MAX_FREQ;
  for (_odir = 0; _odir < 32; _odir ++) {
    max_rate = i2s_apll_get_fi2s(bits_per_sample, 255, 255, *sdm2, _odir);
    min_rate = i2s_apll_get_fi2s(bits_per_sample, 0, 0, *sdm2, _odir);
    avg = (max_rate + min_rate) / 2;
    if (abs(avg - rate) < min_diff) {
      min_diff = abs(avg - rate);
      *odir = _odir;
    }
  }

  // Now calculate best values

  for (_sdm2 = 4; _sdm2 < 9; _sdm2 ++) {
    min_rate = i2s_apll_get_fi2s(bits_per_sample, 0, 0, _sdm2, *odir);
    if (min_rate <= rate) {  //Less or equal ONLY don't overshoot
      *sdm2 = _sdm2;
    }
  }

  min_diff = APLL_MAX_FREQ;
  for (_sdm1 = 0; _sdm1 < 256; _sdm1 ++) {
    //max_rate = i2s_apll_get_fi2s(bits_per_sample, 255, _sdm1, *sdm2, *odir);
    min_rate = i2s_apll_get_fi2s(bits_per_sample, 0, _sdm1, *sdm2, *odir);
    //avg = (max_rate + min_rate)/2;
    if (min_rate <= rate) {  //Less or equal ONLY don't overshoot
      *sdm1 = _sdm1;
    }
  }


  min_diff = APLL_MAX_FREQ;
  for (_sdm0 = 0; _sdm0 < 256; _sdm0 ++) {
    avg = i2s_apll_get_fi2s(bits_per_sample, _sdm0, *sdm1, *sdm2, *odir);
    if (abs(avg - rate) < min_diff) {  // NOW as close as possible
      min_diff = abs(avg - rate);
      *sdm0 = _sdm0;
    }
  }

  return ESP_OK;
}




void init_i2s() {
  esp_err_t err;

  // The I2S config as per the example
  const i2s_config_t i2s_config = {
    .mode = i2s_mode_t(I2S_MODE_MASTER | I2S_MODE_RX), // Receive, not transfer
    .sample_rate = (int)SAMPLING_FREQUENCY,
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

  //i2s_set_clk(I2S_PORT, 37376, I2S_BITS_PER_SAMPLE_32BIT, I2S_CHANNEL_MONO);

  err = i2s_set_pin(I2S_PORT, &pin_config);
  if (err != ESP_OK) {
    Serial.printf("Failed setting pin: %d\n", err);
    while (true);
  }
  Serial.println("I2S driver installed.");

  int sdm0 = 0;
  int sdm1 = 0;
  int sdm2 = 0;
  int odir = 0;
  Serial.println(i2s_apll_calculate_fi2s(I2S_CLOCK, 32, &sdm0, &sdm1, &sdm2, &odir));


  rtc_clk_apll_enable(1, sdm0, sdm1, sdm2, odir);

  Serial.println(sdm0);
  Serial.println(sdm1);
  Serial.println(sdm2);
  Serial.println(odir);

}



int test[128];
const int elements_read = (int)ceil(SAMPLES_SIZE * DOWNSAMPLE_FACTOR);
const int to_read = elements_read * 4;
const int downsample_ratio = (int)DOWNSAMPLE_FACTOR;
int read_in [elements_read];
int to_downsample [(int)DOWNSAMPLE_FACTOR];


void get_samples(int * samples) {


  long prev = micros();

  i2s_start(I2S_PORT);

  int sdm0 = 0;
  int sdm1 = 0;
  int sdm2 = 0;
  int odir = 0;

  i2s_apll_calculate_fi2s(I2S_CLOCK, 32, &sdm0, &sdm1, &sdm2, &odir);

  rtc_clk_apll_enable(1, sdm0, sdm1, sdm2, odir);

  for (int i = 0; i < 55; i++) {


    int num_bytes_read = i2s_read_bytes(I2S_PORT,
                                        (char *)test,
                                        512,     // the doc says bytes, but its elements.
                                        portMAX_DELAY); // no timeout
    double sum = 0.0;

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

  //Serial.println((micros() - prev) / 1000 );

}
