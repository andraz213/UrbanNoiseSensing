#include "handle_spiffs.h"

bool spiffs_inited = false;

bool init_spiffs() {
  if (!spiffs_inited) {
    spiffs_inited = SPIFFS.begin(true);
  }
  return spiffs_inited;
}




String get_config() {
  String res = "";
  if (init_spiffs()) {

    File file = SPIFFS.open("/config.json", "r");

    if (file) {

      while (file.available()) {
        res += String((char)file.read());
      }
    }
  }
  return res;
}



bool write_config(String config) {
  bool res = false;
  if (init_spiffs()) {

    File file = SPIFFS.open("/config.json", "w");

    if (file) {
      uint8_t * buf = (uint8_t *)heap_caps_malloc(sizeof(uint8_t) * config.length(), MALLOC_CAP_8BIT);

      for (int i = 0; i < config.length(); i++) {
        buf[i] = (uint8_t)config.charAt(i);
      }
      res = file.write(buf, config.length());

      file.close();
      free(buf);
    }
  }
  return res;
}
