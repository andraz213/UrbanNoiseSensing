#include "handle_serial.h"
#include "global_defines.h"
#include <Arduino.h>
#include <WiFi.h>
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

void handle_gateway_time(uint8_t *payload, uint16_t length){
got_time = true;
int64_t time_us;
memcpy(&time_us, (char*)(payload + sizeof(int)), sizeof(int64_t));

// ugly, but it works
time_t      tv_sec = (time_t)0;
suseconds_t tv_usec = (suseconds_t)0;

int fact = 1;
for(int i = 0; i<6; i++){
  tv_usec += (time_us%10)*fact;
  time_us -= time_us%10;
  time_us /= 10;
  fact*= 10;
}

fact = 1;
while(time_us){
  tv_sec += (time_us%10)*fact;
  time_us -= time_us%10;
  time_us /= 10;
  fact*= 10;
}

struct timeval tv = { .tv_sec = tv_sec, .tv_usec = tv_usec };
settimeofday(&tv, NULL);
}




void receiver_function(uint8_t *payload, uint16_t length, const PJON_Packet_Info &packet_info) {
  /* Make use of the payload before sending something, the buffer where payload points to is
     overwritten when a new message is dispatched */
  int type = 0;
  memcpy(&type, (char*)payload, sizeof(int));



  if (type == (int) GATEWAY_TIME) {
    handle_gateway_time(payload,length);
  }
};


long last_telemetry = 0;

void send_espnow_telemetry(){
  if(millis() - last_telemetry > 60000 || last_telemetry == 0){
    last_telemetry = millis();
    espnow_telemetry_message* message = (espnow_telemetry_message*)heap_caps_malloc(sizeof(espnow_telemetry_message), MALLOC_CAP_8BIT);
    int type = (int)ESPNOW_GATEWAY_TELEMETRY;

    WiFi.macAddress((uint8_t*)message->mac);

    char* to_send = (char*)heap_caps_malloc(sizeof(espnow_telemetry_message) + sizeof(int), MALLOC_CAP_8BIT);

    memcpy(to_send, &type, sizeof(int));
    memcpy(to_send + sizeof(int), message, sizeof(espnow_telemetry_message));
    uint16_t result = 0;
    int num = 0;
    while(result != PJON_ACK && num < 10){
      num++;
      result = bus.send_packet(GATEWAY_WIFI, to_send, (sizeof(espnow_telemetry_message) + sizeof(int)));
      delay(10);
    }
    delay(60);

    free(message);
    free(to_send);
    Serial.println("sended telemetry");
  }
}

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
  send_espnow_telemetry();

  for (;;) {

    if (get_first() && !bus.update()) {
      message_queue * sending = get_first();
      int type = (int)SENSOR_READING;
      char* mess = (char*)heap_caps_malloc(sizeof(char) * (sending->len + 6) + sizeof(int), MALLOC_CAP_8BIT);

      memcpy(mess, &type, sizeof(int));
      memcpy(mess + sizeof(int), sending->mac, 6);
      memcpy(mess + 6 + sizeof(int), sending->message, sending->len);

      uint16_t result = PJON_ACK;

      result = bus.send_packet(GATEWAY_WIFI, mess, (sending->len + 6 + sizeof(int)));
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

    send_espnow_telemetry();

    vTaskDelay(1);
  }
}
