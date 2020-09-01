#include "arduinoFFT.h"
#include "global_defines.h"
#include <arduino.h>
#include "microphone.h"
#include "spectrum_analysis.h"

double vReal[SAMPLES_SIZE];
double vImag[SAMPLES_SIZE];

arduinoFFT FFT = arduinoFFT(); /* Create FFT object */


double calculate_fft(int * samples, double * result, int num_downsample) {

  for (int i = 0; i < SAMPLES_SIZE; i++) {
    vReal[i] = (double)samples[i];
    vImag[i] = 0;
  }

  FFT.Windowing(vReal, SAMPLES_SIZE, FFT_WIN_TYP_HAMMING, FFT_FORWARD);

  FFT.Compute(vReal, vImag, SAMPLES_SIZE, FFT_FORWARD);

  FFT.ComplexToMagnitude(vReal, vImag, SAMPLES_SIZE);



  double avg = 0.0;
  for (int i = 0; i < SAMPLES_SIZE; i++) {
    avg += vReal[i];
  }

  avg /= 128.0;

  for (int i = 0; i < SAMPLES_SIZE; i++) {

    double ll = log(abs(vReal[i] - avg));

    //Serial.println(ll*ll);
  }

  double x = FFT.MajorPeak(vReal, SAMPLES_SIZE, (int)floor(DOWNSAMPLED_FREQUENCY));

  int usable_fft = SAMPLES_SIZE / 2;

  int num_downsample_ratio = (int)floor(usable_fft / num_downsample);
  int vreal_index = 0;
  for (int i = 0; i < num_downsample; i++) {
    result[i] = 0.0;
    for (int j = 0; j < num_downsample_ratio; j++) {
      result[i] += (vReal[vreal_index] / num_downsample_ratio);
      vreal_index++;
    }
  }

  Serial.println(x);
  return x;
}
