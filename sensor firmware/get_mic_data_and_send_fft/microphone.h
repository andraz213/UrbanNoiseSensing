#ifndef MICROPHONE_H
#define MICROPHONE_H
#include "global_defines.h"

#define BLOCK_SIZE         128
#define SAMPLES_SIZE       256
#define READ_IN_SIZE       5120

#define I2S_PORT           I2S_NUM_0



//const i2s_port_t I2S_PORT = I2S_NUM_0;



void init_i2s();
void get_samples(int * samples);

#endif
