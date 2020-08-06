#include "handle_serial.h"
#include "global_defines.h"
#include <Arduino.h>
#define PJON_PACKET_MAX_LENGTH 500
#define PJON_MAX_PACKETS 10
#define PJON_INCLUDE_ASYNC_ACK true
#define PJON_INCLUDE_TSA true

#include <PJON.h>
#include "message_queue.h"
#include "apps/sntp/sntp.h"
#include <sys/time.h>

PJON<ThroughSerialAsync> bus(1);



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

bool got_time = false;

void receiver_function(uint8_t *payload, uint16_t length, const PJON_Packet_Info &packet_info) {
  /* Make use of the payload before sending something, the buffer where payload points to is
     overwritten when a new message is dispatched */
  int type = 0;
  Serial.println(length);
  Serial.println("neki sm dubu");
  memcpy(&type, (char*)payload, sizeof(int));


  if (type == (int) GATEWAY_TIME) {
    got_time = true;
    int64_t time_us;
    memcpy(&time_us, (char*)(payload + sizeof(int) - 1), sizeof(int64_t));

    Serial.println((long) time_us);

    time_t      tv_sec = (time_t)(time_us - time_us % 1000000) / 1000000;
    suseconds_t tv_usec = (suseconds_t)time_us % 1000000;

    struct timeval tv = { .tv_sec = tv_sec, .tv_usec = tv_usec };
    settimeofday(&tv, NULL); \


  };



};


void update_time() {
  bus.receive(1000);
  bus.update();
  bus.receive(1000);
  bus.update();
  got_time = false;
  int type = (int)TIME_REQUEST;
  bus.send_packet(GATEWAY_WIFI, &type, sizeof(int));
  int num = 0;
  long start = millis();
  while (!got_time && millis() - start < 100) {
    bus.receive(1000);
    bus.update();
    num++;
  }
  Serial.println(num);
}




long last_time_update = 0;


void TaskSerial( void *pvParameters ) {
  delay(2000);
  bus.strategy.set_serial(&Serial2);
  bus.set_error(error_handler);
  bus.set_receiver(receiver_function);
  bus.set_crc_32(false);
  bus.set_communication_mode(PJON_HALF_DUPLEX);
  bus.begin();

  Serial.println(TSA_RESPONSE_TIME_OUT);


  for (;;) {

    if (get_first() && !bus.update()) {
      message_queue * sending = get_first();

      char* mess = (char*)heap_caps_malloc(sizeof(char) * (sending->len + 6), MALLOC_CAP_8BIT);
      memcpy(mess, sending->mac, 6);
      memcpy(mess + 6, sending->message, sending->len);
      uint16_t result = PJON_ACK;

      result = bus.send_packet(GATEWAY_WIFI, mess, (sending->len + 6));
      // delay(10);
      free(mess);
      if (result == PJON_ACK) {
        remove_first();
        Serial.println("                                         succeed");
      } else {
        Serial.println("                                                   failed");
      }

    }

    //bus.receive(50000);

    bus.receive(10000);
    if (bus.update() < 0 ) {
      Serial.println("to be sent");
      Serial.println(bus.update());
    }

    if (millis() - last_time_update > 5000) {
      last_time_update = millis();
      update_time();
      delay(50);

    }


    vTaskDelay(1);
  }
}
