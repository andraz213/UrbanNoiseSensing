#include "internal_config.h"

uint8_t internal_mac [6];
bool mac_was_set = false;


void set_espnow_mac(uint8_t * mac){
  for(int i = 0; i<6; i++){
    internal_mac[i] = mac[i];
  }
  mac_was_set = true;
}

bool get_espnow_mac(uint8_t * mac){
  if(mac_was_set){
    for(int i = 0; i<6; i++){
       mac[i] = internal_mac[i];
    }
  }
  return mac_was_set;
}
