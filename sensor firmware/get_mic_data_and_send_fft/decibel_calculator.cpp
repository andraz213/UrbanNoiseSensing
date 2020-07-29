
#include <arduino.h>
#include "sos-iir-filter.h"
#define LEQ_PERIOD        0.1           // second(s)
#define WEIGHTING         C_weighting // Also avaliable: 'C_weighting' or 'None' (Z_weighting)
#define LEQ_UNITS         "LAeq"      // customize based on above weighting used
#define DB_UNITS          "dBA"       // customize based on above weighting used
#define USE_DISPLAY       1

// NOTE: Some microphones require at least DC-Blocker filter
#define MIC_EQUALIZER     INMP441    // See below for defined IIR filters or set to 'None' to disable
#define MIC_OFFSET_DB     3.0103      // Default offset (sine-wave RMS vs. dBFS). Modify this value for linear calibration

// Customize these values from microphone datasheet
#define MIC_SENSITIVITY   -26         // dBFS value expected at MIC_REF_DB (Sensitivity value from datasheet)
#define MIC_REF_DB        94.0        // Value at which point sensitivity is specified in datasheet (dB)
#define MIC_OVERLOAD_DB   116.0       // dB - Acoustic overload point
#define MIC_NOISE_DB      29          // dB - Noise floor
#define MIC_BITS          24          // valid number of bits in I2S data
#define MIC_CONVERT(s)    (s >> 8)
#define MIC_TIMING_SHIFT  0           // Set to one to fix MSB timing for some microphones, i.e. SPH0645LM4H-x

// Calculate reference amplitude value at compile time
constexpr double MIC_REF_AMPL = pow(10, double(MIC_SENSITIVITY) / 20) * ((1 << (MIC_BITS - 1)) - 1);


SOS_IIR_Filter C_weighting = {
gain: -0.491647169337140,
sos: {
    { +1.4604385758204708, +0.5275070373815286, +1.9946144559930252, -0.9946217070140883},
    { +0.2376222404939509, +0.0140411206016894, -1.3396585608422749, -0.4421457807694559},
    { -2.0000000000000000, +1.0000000000000000, +0.3775800047420818, -0.0356365756680430}
  }
};

// DC-Blocker filter - removes DC component from I2S data
// See: https://www.dsprelated.com/freebooks/filters/DC_Blocker.html
// a1 = -0.9992 should heavily attenuate frequencies below 10Hz
SOS_IIR_Filter DC_BLOCKER = {
  gain: 1.0,
sos: {{ -1.0, 0.0, +0.9992, 0}}
};


SOS_IIR_Filter INMP441 = {
  gain: 1.00197834654696,
sos: { // Second-Order Sections {b1, b2, -a1, -a2}
    { -1.986920458344451, +0.986963226946616, +1.995178510504166, -0.995184322194091}
  }
};




















double calculate_decibels(int* input_samples, int num_samples){
  // i2s_read(I2S_PORT, &samples, SAMPLES_SHORT * sizeof(SAMPLE_T), &bytes_read, portMAX_DELAY);
float samples[num_samples] __attribute__((aligned(4)));
// Convert (including shifting) integer microphone values to floats,
// using the same buffer (assumed sample size is same as size of float),
// to save a bit of memory
for (int i = 0; i < num_samples; i++) {
  samples[i] = input_samples[i];//MIC_CONVERT(input_samples[i]);
}

// Apply equalization and calculate Z-weighted sum of squares,
// writes filtered samples back to the same buffer.
float sum_sqr_SPL = MIC_EQUALIZER.filter(samples, samples, (size_t)num_samples);

// Apply weighting and calucate weigthed sum of squares
float sum_sqr_weighted = WEIGHTING.filter(samples, samples, (size_t)num_samples);



// Calculate dB values relative to MIC_REF_AMPL and adjust for microphone reference
double short_RMS = sqrt(double(sum_sqr_SPL) / num_samples);
double short_SPL_dB = MIC_OFFSET_DB + MIC_REF_DB + 20 * log10(short_RMS / MIC_REF_AMPL);

double Leq_dB = 0.0;
// Accumulate Leq sum
double Leq_sum_sqr = sum_sqr_weighted;
int Leq_samples = num_samples;

double Leq_RMS = sqrt(Leq_sum_sqr / Leq_samples);
Leq_dB = MIC_OFFSET_DB + MIC_REF_DB + 20 * log10(Leq_RMS / MIC_REF_AMPL);


Serial.printf("%.1f\n", Leq_dB);


return Leq_dB;


}
