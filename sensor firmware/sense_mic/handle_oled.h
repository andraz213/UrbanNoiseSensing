#ifndef HANDLE_OLED_H
#define HANDLE_OLED_H

#include <arduino.h>
void print_text(String text1, String text2, String text3, String text4);

void print_big_text(String text1, String text2);

void print_biggest_text(String text1);

void show_spectrogram(int size, double * values, double decibels, double max_freq, String name);


void oled_off();
void oled_on();
void draw_rect();


#endif
