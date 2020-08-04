#include "handle_serial.h"
#include <Arduino.h>
#define PJON_PACKET_MAX_LENGTH 500
#define PJON_MAX_PACKETS 10
#include <PJON.h>
#include "message_queue.h"

PJON<ThroughSerial> bus(1);



void error_handler(uint8_t code, uint16_t data, void *custom_pointer) {
  if(code == PJON_CONNECTION_LOST) {
    Serial.print("Connection with device ID ");
    Serial.print(bus.packets[data].content[0], DEC);
    Serial.println(" is lost.");
  }
  if(code == PJON_PACKETS_BUFFER_FULL) {
    Serial.print("Packet buffer is full, has now a length of ");
    Serial.println(data, DEC);
    Serial.println("Possible wrong bus configuration!");
    Serial.println("higher PJON_MAX_PACKETS if necessary.");
  }
  if(code == PJON_CONTENT_TOO_LONG) {
    Serial.print("Content is too long, length: ");
    Serial.println(data);
  }
};


void receiver_function(uint8_t *payload, uint16_t length, const PJON_Packet_Info &packet_info) {
  /* Make use of the payload before sending something, the buffer where payload points to is
     overwritten when a new message is dispatched */
  if((char)payload[0] == 'B') {
    if(!bus.update()) // If all packets are delivered, send another
      bus.reply("B", 1);
    digitalWrite(LED_BUILTIN, HIGH);
    delay(5);
    digitalWrite(LED_BUILTIN, LOW);
    delay(5);
  }
};




void TaskSerial( void *pvParameters ){
  delay(2000);
  Serial.println("here");

Serial.println("here");
  bus.strategy.set_serial(&Serial2);
  Serial.println("here");
  bus.set_error(error_handler);
  Serial.println("here");
  bus.set_receiver(receiver_function);
  bus.set_crc_32(true);
  Serial.println("here");
  bus.begin();
  Serial.println("here");

  for(;;){
    Serial.println("here");

    if(get_first()){
      message_queue * sending = get_first();

      char* mess = (char*)heap_caps_malloc(sizeof(char) * (sending->len + 6), MALLOC_CAP_8BIT);
      memcpy(mess, sending->mac, 6);
      memcpy(&mess[5], sending->message, sending->len);

      Serial.println(bus.send(2, mess, (sending->len + 6)));
      free(mess);
        remove_first();

    }

    //bus.receive(50000);
    bus.receive();
    bus.update();


    vTaskDelay(1);
  }
}
