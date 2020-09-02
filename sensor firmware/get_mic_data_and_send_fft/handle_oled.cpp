#include "handle_oled.h"
#include "global_defines.h"
#include <arduino.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

Adafruit_SSD1306 display(128, 32, &Wire, -1);

bool inited_oled = false;

bool init_oled() {
  if (!inited_oled) {
    inited_oled = display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
    if (inited_oled) {
      display.display();
      display.clearDisplay();
    }
  }
  return inited_oled;
}

void print_text(String text1, String text2, String text3, String text4) {
  if (init_oled()) {
    display.clearDisplay();
    display.setTextSize(1);      // Normal 1:1 pixel scale
    display.setTextColor(SSD1306_WHITE); // Draw white text
    display.setCursor(0, 0);
    display.println(text1);
    display.println(text2);
    display.println(text3);
    display.println(text4);
    display.display();
  }
}


double average = 0.0;
void show_spectrogram(int size, double * values, double decibels, double max_freq, String name) {

  if (init_oled()) {
    display.clearDisplay();
    display.setTextSize(1);      // Normal 1:1 pixel scale
    display.setTextColor(SSD1306_WHITE); // Draw white text
    display.setCursor(0, 0);
    display.println(name);
    display.println(decibels);
    display.println(max_freq);

    double max_fft = 0.0;
    for (int i = 0; i < size; i++) {
      if (values[i] > max_fft) {
        max_fft = values[i];
      }
    }

    if (max_fft > average) {
      average = max_fft;
    } else {
      average *= 0.9;
      max_fft += 0.1;
    }

    for (int i = 0; i < size; i++) {
      int height = map(values[i], 0, (int)average, 0, 28);
      display.drawLine(i * 2 + 74, 31, i * 2 + 74, 31 - height, SSD1306_WHITE);
    }

    display.println(average);
    display.display();

  }
}
