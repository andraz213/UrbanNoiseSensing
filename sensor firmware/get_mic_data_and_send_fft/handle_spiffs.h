#ifndef HANDLE_SPIFFS_H
#define HANDLE_SPIFFS_H

#include "FS.h"
#include "SPIFFS.h"
bool init_spiffs();
String get_config();
bool write_config(String config);

#endif
