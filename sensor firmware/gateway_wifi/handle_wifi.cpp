#include "handle_wifi.h"
#include <Arduino.h>
#include "message_queue.h"
#include <esp_pm.h>
#include <esp_wifi.h>
#include <esp_wifi_internal.h>
#include <esp_wifi_types.h>
#include "message_queue.h"
#include <esp_now.h>
#include <WiFi.h>
#include <WiFiMulti.h>
#include <HTTPClient.h>
#include "handle_time.h"
#include "handle_oled.h"
#include "internal_config.h"
#include <ArduinoJson.h>
#include <ArduinoWebsockets.h>
const char* ssid = "PSP256";
const char* password = "siol2004";
const char* serverName = "http://urbannoisesensing.herokuapp.com";


const char* websockets_server_host = "192.168.1.7"; //Enter server adress
const uint16_t websockets_server_port = 3000; // Enter server port

using namespace websockets;

WebsocketsClient client;

void init_wifi() {
  if (WiFi.status() != WL_CONNECTED) {
    print_text(String("Connecting to "), String(ssid), "", "");
    Serial.println("wifi");
    // init esp_now
    WiFi.mode(WIFI_STA);
    int a = esp_wifi_set_protocol( WIFI_IF_STA, WIFI_PROTOCOL_11B | WIFI_PROTOCOL_11G | WIFI_PROTOCOL_11N );
    WiFi.begin(ssid, password);
    long start_wifi_connect = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - start_wifi_connect < 60000) {
      Serial.print("|");
      delay(250);
    }
    init_time();

    print_text(String("Success!"), String(ssid), "", "");
    delay(1000);
  }


}

void TaskWifi( void *pvParameters ) {

  while(WiFi.status() != WL_CONNECTED) {
    vTaskDelay(10);
  }


  bool connected = client.connect(websockets_server_host, websockets_server_port, "/");
  if(connected) {
    Serial.println("Connected!");
    client.send("Hello Server");
  } else {
    Serial.println("Not Connected!");
  }

// run callback when messages are received
client.onMessage([&](WebsocketsMessage message){
    Serial.print("Got Message: ");
    Serial.println(message.data());
});




  for (;;) {


  vTaskDelay(1);

  if(client.available()) {
    client.poll();
  }

  send_data();
  //delay(5);

  }
}

void get_config(){

  uint8_t mac [6];

  if(get_espnow_mac(mac)){
    String body = "{\"mac\":[" + String(mac[0]) + "," + String(mac[1]) + "," + String(mac[2]) + "," + String(mac[3]) + "," + String(mac[4]) + "," + String(mac[5]) + "]}";

    Serial.println(body);
    String url = String(serverName) + String("/api/gateway/");
    Serial.println(url);
    HTTPClient http;
    http.begin(url);
    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.POST(body);
    Serial.println(httpResponseCode);


    String result = http.getString();

    Serial.println(result);
    Serial.println(result.length());

    //http.end();
    /*
    if (httpResponseCode == 200) {
      return true;
    }
    return false;

  }*/
}
}



void send_data(){

  StaticJsonDocument<500> doc;
  message_queue * message = get_first();

  if((long)message != 0){
    if(message -> type == (int)SENSOR_READING){
        doc["type"] = "SENSOR_READING";
        JsonArray mac = doc.createNestedArray("mac");
        for(int i = 0; i<6; i++){
          mac.add(message->mac[i]);
        }
        sending_list * data = (sending_list *)message->message;
        doc["fft_range"] = data->fft_range;
        doc["decibels"] = data->decibels;
        doc["timestamp"] = data->timestamp;
        JsonArray fft_values = doc.createNestedArray("fft_values");
        for(int i = 0; i<16; i++){
          fft_values.add(data->fft_values[i]);
        }

        String jsn;
        serializeJson(doc, jsn);
        client.send(jsn);
        remove_first();

    }

    if(message -> type == (int)SENOSR_TELEMETRY){
        doc["type"] = "SENOSR_TELEMETRY";


        JsonArray mac = doc.createNestedArray("mac");
        for(int i = 0; i<6; i++){
          mac.add(message->mac[i]);
        }
        telemetry_message * data = (telemetry_message *)message->message;
        doc["battery_voltage"] = data->battery_voltage;
        String jsn;
        serializeJson(doc, jsn);
        client.send(jsn);
        remove_first();
    }


  }


}
