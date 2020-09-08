#include "handle_serial.h"
#include "global_defines.h"
#include <Arduino.h>
#define PJON_PACKET_MAX_LENGTH 500
#define PJON_MAX_PACKETS 10
#define PJON_INCLUDE_ASYNC_ACK true
#define PJON_INCLUDE_TSA true
#define TS_BACK_OFF_DEGREE 4
#define TS_RESPONSE_TIME_OUT 100000

#include <PJON.h>
#include "message_queue.h"
#include "handle_time.h"
#include "internal_config.h"

PJON<ThroughSerialAsync> bus(GATEWAY_WIFI);



void error_handler(uint8_t code, uint16_t data, void *custom_pointer) {
  if (code == PJON_CONNECTION_LOST) {
    Serial.print("Connection with device ID ");
    Serial.print(bus.packets[data].content[0], DEC);
    Serial.println(" is lost.");
  }
  if (code == PJON_PACKETS_BUFFER_FULL) {
    Serial.print("Packet buffer is full, has now a length of ");
    Serial.println(data, DEC);
    Serial.println("Possible wrong bus configuration!");
    Serial.println("higher PJON_MAX_PACKETS if necessary.");
  }
  if (code == PJON_CONTENT_TOO_LONG) {
    Serial.print("Content is too long, length: ");
    Serial.println(data);
  }
};

long previous_time_update = 0;

void receiver_function(uint8_t *payload, uint16_t length, const PJON_Packet_Info &packet_info) {
  /* Make use of the payload before sending something, the buffer where payload points to is
     overwritten when a new message is dispatched */
  int type = 0;
  memcpy(&type, (char*)payload, sizeof(int));
  Serial.println(":::::::::::::::::::::::::::::::::");
  Serial.println(type);
  Serial.println(heap_caps_get_free_size(MALLOC_CAP_8BIT));

  if (type == (int) TIME_REQUEST) {
    handle_time_request(payload);
    return;
  }

  Serial.println(heap_caps_get_free_size(MALLOC_CAP_8BIT));
  int datalen = length - sizeof(int) - 6;
  char * mac =  (char*)heap_caps_malloc(sizeof(char) * 6, MALLOC_CAP_8BIT);
  char * data = (char*)heap_caps_malloc(sizeof(char) * datalen, MALLOC_CAP_8BIT);

  Serial.println(heap_caps_get_free_size(MALLOC_CAP_8BIT));
  while(data == 0){
  Serial.println(heap_caps_get_free_size(MALLOC_CAP_8BIT));
    data = (char*)heap_caps_malloc(sizeof(char) * datalen, MALLOC_CAP_8BIT);
  }
  memcpy(mac, (char*)payload + sizeof(int), sizeof(char) * 6);
  memcpy(data, (char*)payload + sizeof(int) + 6, sizeof(char) * datalen);
  Serial.println(datalen);
  Serial.println((long)data);
  if (type == (int) SENSOR_READING) {
    handle_sensor_reading(mac, data, datalen, type);

  }
  if(type == (int) SENOSR_TELEMETRY){
    handle_sensor_telemetry(mac, data, datalen, type);
  }


  free(data);
  free(mac);


};


/*
to dobim preko seriala
int type
char mac [6]
char data (data je potem lahko al tlemetry message al pa sending list)
*/



void update_gateway_time() {
  if (millis() - previous_time_update > 1000) {
    int64_t time_us = get_us_time();
    if (time_us != -1) {

      Serial.println((long)time_us);
      int size = sizeof(int) + sizeof(int64_t);
      int message_typ = (int)GATEWAY_TIME;
      char* message = (char*)heap_caps_malloc(size, MALLOC_CAP_8BIT);
      memcpy(message, (char*)&message_typ, sizeof(int));
      memcpy(message + sizeof(int), (char*)&time_us, sizeof(int64_t));
      uint16_t result = bus.send_packet(GATEWAY_ESPNOW, message, size);
      previous_time_update = millis() - 850;
      if (result == PJON_ACK) {
        previous_time_update = millis();
      }
      free(message);

    }


  }


}


void init_pjon() {
  Serial.println("initing pjon");
  bus.strategy.set_serial(&Serial2);
  bus.set_error(error_handler);
  bus.set_receiver(receiver_function);
  bus.set_crc_32(false);
  bus.begin();
  Serial.println("inited pjon");
}

void TaskSerial( void *pvParameters ) {


  delay(20);
  init_pjon();

  for (;;) {



    //bus.receive(50000);
    if(heap_caps_get_free_size(MALLOC_CAP_8BIT) > 51000){
      bus.receive(20000);
      if (bus.update() > 0) {
        Serial.println("to be sent");
        Serial.println(bus.update());
      }
    }




    // update_gateway_time();

    vTaskDelay(1);
  }
}



void handle_sensor_reading(char * mac, char * data, int datalen, int type){

    if(datalen == sizeof(sending_list)){
      sending_list * hnd = (sending_list *)heap_caps_malloc(sizeof(sending_list), MALLOC_CAP_8BIT);

      memcpy(hnd, (char*) data, sizeof(sending_list));


      Serial.println(hnd->decibels);
      free(hnd);

      char * tmp = (char*)heap_caps_malloc(sizeof(sending_list), MALLOC_CAP_8BIT);
      memcpy(tmp, data, sizeof(sending_list));
      char * tmpmac = (char*)heap_caps_malloc(sizeof(char) * 6, MALLOC_CAP_8BIT);
      memcpy(tmpmac, mac, 6);
      add_to_message_queue((char*)tmp, sizeof(sending_list), (char*)tmpmac);

      free(tmpmac);
      free(tmp);
  } else {
    Serial.println(" SENSOR JEBA JEBA JEBA !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  }


}

void handle_sensor_telemetry(char * mac, char * data, int datalen, int type){



    if(datalen == sizeof(telemetry_message)){
      telemetry_message * hnd = (telemetry_message *)heap_caps_malloc(sizeof(telemetry_message), MALLOC_CAP_8BIT);

      memcpy(hnd, (char*)data + datalen - sizeof(telemetry_message), sizeof(telemetry_message));
      Serial.println(datalen);
      Serial.print("                VOLTAGE BABY  ");
      Serial.println(hnd->battery_voltage);
      free(hnd);
      char * tmp = (char*)heap_caps_malloc(sizeof(telemetry_message), MALLOC_CAP_8BIT);
      memcpy(tmp, data, sizeof(telemetry_message));
      char * tmpmac = (char*)heap_caps_malloc(sizeof(char) * 6, MALLOC_CAP_8BIT);
      memcpy(tmpmac, mac, 6);
      add_to_message_queue((char*)tmp, sizeof(telemetry_message), (char*)tmpmac);

      free(tmpmac);
      free(tmp);
  } else {
    Serial.println("JEBA JEBA JEBA !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  }

}


void handle_time_request(uint8_t *payload){

  gateway_time_request * time_req = (gateway_time_request *)heap_caps_malloc(sizeof(gateway_time_request), MALLOC_CAP_8BIT);
  memcpy(time_req, payload, sizeof(gateway_time_request));
  set_espnow_mac(time_req->mac);
  free(time_req);

  if (millis() - previous_time_update > 1000) {
    previous_time_update = millis();

    int64_t time_us = get_us_time();
    if (time_us != -1) {

      Serial.println((long)time_us);
      int size = sizeof(int) + sizeof(int64_t);
      int message_typ = (int)GATEWAY_TIME;
      char* message = (char*)heap_caps_malloc(size, MALLOC_CAP_8BIT);
      memcpy(message, (char*)&message_typ, sizeof(int));
      memcpy(message + sizeof(int), (char*)&time_us, sizeof(int64_t));
      uint16_t result = bus.reply(message, size);
      free(message);
    }
  }
  long start_time = micros();
  int num = 0;
  bus.receive(20);
  while (bus.update() > 0) {
    bus.receive(500);
    num++;
  }
  long end = micros();
  bus.receive(500);
  Serial.println(end - start_time);
  Serial.println(num);

}
