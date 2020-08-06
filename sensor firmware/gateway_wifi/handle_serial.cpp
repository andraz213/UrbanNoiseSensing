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

  if (type == (int) TIME_REQUEST) {
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




  for (int i = 0; i < min((int)length, 20); i++) {
    Serial.print(payload[i + 20], HEX);
  }
  Serial.println();
};



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
    bus.receive(20000);
    if (bus.update() > 0) {
      Serial.println("to be sent");
      Serial.println(bus.update());
    }




    // update_gateway_time();

    vTaskDelay(1);
  }
}
