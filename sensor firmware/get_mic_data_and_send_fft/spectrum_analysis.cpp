#include "arduinoFFT.h"
#include <arduino.h>
#include "microphone.h"
#include "spectrum_analysis.h"

double vReal[SAMPLES_SIZE];
double vImag[SAMPLES_SIZE];

arduinoFFT FFT = arduinoFFT(); /* Create FFT object */


void calculate_fft(int * samples){

  for (int i = 0; i < SAMPLES_SIZE; i++) {
    vReal[i] = (double)samples[i];
    vImag[i] = 0;
  }

  FFT.Windowing(vReal, SAMPLES_SIZE, FFT_WIN_TYP_HAMMING, FFT_FORWARD);

  FFT.Compute(vReal, vImag, SAMPLES_SIZE, FFT_FORWARD);

  FFT.ComplexToMagnitude(vReal, vImag, SAMPLES_SIZE);


  for(int i = 0; i< SAMPLES_SIZE; i++){

    Serial.println(vReal[i]);
  }

  double x = FFT.MajorPeak(vReal, SAMPLES_SIZE, 2940);
  Serial.println(x, 6);


}
