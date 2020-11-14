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


const char* ssid2 = "UNSwifi";
const char* password2 = "uns12wifi34";
const char* serverName = "http://urbannoisesensing.biolab.si";

WiFiMulti wifiMulti;


long average_RTT [50][2];
int average_RTT_index = 0;

String jsn_body = "";
String jsn_telemetry = "";
int data_tries = 0;
int telemetry_tries = 0;

HTTPClient http;


const char* websockets_server_host =  "urbannoisesensing.biolab.si"; //"192.168.1.7"; //Enter server adress
const uint16_t websockets_server_port = 90; //  3000; // Enter server port
bool got_reply = false;
using namespace websockets;

WebsocketsClient client;
HTTPClient httpClient;

uint8_t latest_rssi = 0;


/*
void init_wifi() {
  if (WiFi.status() != WL_CONNECTED) {
    print_text(String("Connecting to "), String(ssid), "", "");
    Serial.println("wifi");
    // init esp_now
    WiFi.mode(WIFI_STA);
    int a = esp_wifi_set_protocol( WIFI_IF_STA, WIFI_PROTOCOL_11B | WIFI_PROTOCOL_11G | WIFI_PROTOCOL_11N );
    WiFi.begin(ssid, password);
    long start_wifi_connect = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - start_wifi_connect < 20000) {
      Serial.print("|");
      delay(250);
    }

    if(WiFi.status() != WL_CONNECTED){
        /*esp_wifi_disconnect();
        esp_wifi_stop();
        esp_wifi_deinit();*/
        /*
        WiFi.disconnect(true);
        print_text(String("Failed!"), String(ssid), "", "");
    } else {
      init_time();

      print_text(String("Success!"), String(ssid), "", "");
    }



    delay(1000);
  }


}*/

/*
void init_wifi() {
  if (WiFi.status() != WL_CONNECTED) {
    //wifiMulti.cleanAPlist();
    wifiMulti.addAP(ssid, password);
    wifiMulti.addAP(ssid2, password2);
    //get_wifi_credentials(wifiMulti);
    print_text(String("Connecting to "), String(ssid), "", "");
    Serial.println("wifi");
    // init esp_now
    //WiFi.mode(WIFI_STA);
    //int a = esp_wifi_set_protocol( WIFI_IF_STA, WIFI_PROTOCOL_11B | WIFI_PROTOCOL_11G | WIFI_PROTOCOL_11N );

    if(wifiMulti.run() != WL_CONNECTED){
        print_text(String("Failed!"), String(ssid), "", "");
    } else {
      init_time();

      print_text(String("Success!"), String(ssid), "", "");
    }
    delay(1000);
  }


}
*/


// s skeniranjem pa tkko no

void init_wifi() {
  if (WiFi.status() != WL_CONNECTED) {
    print_text(String("Scanning for"), String("WiFi networks"), "", "");
    WiFi.mode(WIFI_STA);
    int a = esp_wifi_set_protocol( WIFI_IF_STA, WIFI_PROTOCOL_11B | WIFI_PROTOCOL_11G | WIFI_PROTOCOL_11N );

    int n = WiFi.scanNetworks();
    Serial.println(n);

    for(int i = 0; i<n; i++){
      String current = WiFi.SSID(i);
      Serial.println(current);

      String password_got = check_wifi_credentials(current);
      Serial.println(current);
      if(password_got.length() > 0){
        print_text(String("Connecting to "), String(current), "", "");
        delay(10);
        WiFi.begin(String(current).c_str(), String(password_got).c_str());
        if(handle_connecting(current)){
          return;
        }
      }


      if(current.equals(ssid)){
        print_text(String("Connecting to "), String(current), "", "");
        delay(10);
        WiFi.begin(String(ssid).c_str(), String(password).c_str());
        if(handle_connecting(current)){
          return;
        }

      }



      if(current.equals(ssid2)){
        print_text(String("Connecting to "), String(current), "", "");
        delay(10);
        WiFi.begin(String(ssid2).c_str(), String(password2).c_str());
        if(handle_connecting(current)){
          return;
        }
      }





    }
  }
}




bool handle_connecting(String current){

  long start_wifi_connect = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - start_wifi_connect < 20000) {
    delay(250);
  }

  if(WiFi.status() != WL_CONNECTED){
    print_text(String("Failed!"), String(current), "", "");
    delay(1000);
  }else{

    init_time();

    print_text(String("Success!"), String(current), "", "");

    delay(1000);
    return true;

  }
  return false;
}




void TaskWifi( void *pvParameters ) {

  while(WiFi.status() != WL_CONNECTED) {
    vTaskDelay(10);
  }
  get_wifi_config();

  // bool connected = client.connect(websockets_server_host, websockets_server_port, "/");
  bool connected = httpClient.begin(serverName);

  if(connected) {
    Serial.println("Connected!");
    //client.send("Hello Server");
  } else {
    Serial.println("Not Connected!");
  }

// run callback when messages are received
client.onMessage([&](WebsocketsMessage message){
    got_reply = true;
});


  for (;;) {
    Serial.println("-----------------------taskWifi");

    if(heap_caps_get_free_size(MALLOC_CAP_8BIT) < 50000 &&
        jsn_body.equals("") &&
        jsn_telemetry.equals("") &&
        get_first() == 0){
          //ESP.restart();

            Serial.println("FAKKKKKKKK");

        }

    //init_wifi();
  if(WiFi.status() == WL_CONNECTED){

  latest_rssi = WiFi.RSSI();
  get_wifi_config();
  vTaskDelay(10);
  prepare_jsn_data();
  if(!jsn_body){
    jsn_body = "";
  }
  if(!jsn_telemetry){
    jsn_telemetry = "";
  }


  if(jsn_body && jsn_body.length() != 0 && WiFi.status() == WL_CONNECTED){
    send_data();
    data_tries++;
    if(data_tries > 10){
      jsn_body = "";
    }
  }

  if(jsn_telemetry && jsn_telemetry.length() != 0 && WiFi.status() == WL_CONNECTED){
    send_telemetry();
    telemetry_tries++;
    if(telemetry_tries > 10){
      jsn_telemetry = "";
    }
  }

  //delay(5);
  get_measurement_interval_config();
}

  vTaskDelay(10);


  }

}





long prev_config = 0;

void get_wifi_config(){

  if(millis() - prev_config < 10000){
    return;
  }
  prev_config = millis();

  uint8_t mac [6];

  if(get_espnow_mac(mac)){
    String body = "{\"mac\":[" + String(mac[0]) + "," + String(mac[1]) + "," + String(mac[2]) + "," + String(mac[3]) + "," + String(mac[4]) + "," + String(mac[5]) + "]}";

    String url = String(serverName) + String("/api/gateway/");
    Serial.println(url);
    long start = millis();
    http.begin(url);
    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.POST(body);
    Serial.println(httpResponseCode);

    String result = http.getString();

    Serial.println(result);
    Serial.println(result.length());
    write_config(result);


    http.end();
    add_rtt(millis() - start);
    /*
    if (httpResponseCode == 200) {
      return true;
    }
    return false;

  }*/
}
}




void send_data(){
  long start = millis();
  String url = serverName;
  url += String("/api/sensor/data");
  Serial.println(url);
  HTTPClient http;
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  got_reply = false;
  long sent = millis();
  int httpResponseCode = http.POST(jsn_body);
  http.end();
  add_rtt(millis() - start);

  if(httpResponseCode == 200){
    jsn_body = "";
  }

  got_reply = true;


          long RTT = millis() - sent;
          Serial.print("               RTT time for http: ");
          Serial.println(RTT);
          average_RTT[average_RTT_index][0] = millis();
          average_RTT[average_RTT_index][1] = RTT;
          average_RTT_index ++;
          average_RTT_index %= 50;

    }



    void send_telemetry(){
      long start = millis();
      String url = serverName;
      url += String("/api/sensor/telemetry");
      Serial.println(url);
      HTTPClient http;
      http.begin(url);
      http.addHeader("Content-Type", "application/json");
      got_reply = false;
      long sent = millis();
      int httpResponseCode = http.POST(jsn_telemetry);
      http.end();
      add_rtt(millis() - start);

      if(httpResponseCode == 200){
        jsn_telemetry = "";
      }

      got_reply = true;


              long RTT = millis() - sent;
              Serial.print("               RTT time for http: ");
              Serial.println(RTT);
              average_RTT[average_RTT_index][0] = millis();
              average_RTT[average_RTT_index][1] = RTT;
              average_RTT_index ++;
              average_RTT_index %= 50;

        }



void send_data_websocket(){

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
        got_reply = false;
        client.send(jsn);
        long sent = millis();
        while(got_reply != true && millis() - sent < 1){
          if(client.available()) {
            client.poll();
          }
        }

        got_reply = true;

        if(got_reply == true){
          long RTT = millis() - sent;
          Serial.print("               RTT time for websockets: ");
          Serial.println(RTT);
          average_RTT[average_RTT_index][0] = millis();
          average_RTT[average_RTT_index][1] = RTT;
          average_RTT_index ++;
          average_RTT_index %= 50;



          remove_first();
        }

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


int get_RTT_average(){

  long average_RTT_num = 0;
  int num = 0;
  for(int i = 0; i<50; i++){
    if(millis() - average_RTT[i][1] <= 2000){
      average_RTT_num += average_RTT[i][0];
      num ++;
    }
  }
  if(num == 0){
    return 0;
  }
  average_RTT_num /= num;
  return (int)average_RTT_num;
}


int get_sent_in_last_second(){

  int num = 0;
  for(int i = 0; i<50; i++){
    if(millis() - average_RTT[i][0] <= 1000){
      num ++;
    }
  }
  return num;
}


void prepare_jsn_data(){
  if(jsn_body.length() > 10 || jsn_telemetry.length() > 10){
    return;
  }

  int it = 0;
  int itele = 0;
  DynamicJsonDocument doc(25000);
  DynamicJsonDocument tele_doc(5000);
  message_queue * message = get_first();

  while(it < 32 && itele < 10 && message != (message_queue*)0){
    if(message -> type != (int)SENOSR_TELEMETRY){
      JsonObject measurement = doc.createNestedObject();

      JsonArray mac = measurement.createNestedArray("mac");
      for(int i = 0; i<6; i++){
        mac.add(message->mac[i]);
      }
      sending_list * data = (sending_list *)message->message;
      measurement["fft_range"] = data->fft_range;
      measurement["decibels"] = data->decibels;
      measurement["timestamp"] = data->timestamp;
      JsonArray fft_values = measurement.createNestedArray("fft_values");
      for(int i = 0; i<16; i++){
        fft_values.add(data->fft_values[i]);
      }

      it++;
    }


    if(message -> type == (int)SENOSR_TELEMETRY){
      JsonObject telemetry = tele_doc.createNestedObject();

      JsonArray mac = telemetry.createNestedArray("mac");
      for(int i = 0; i<6; i++){
        mac.add(message->mac[i]);
      }
      telemetry_message * data = (telemetry_message *)message->message;
      telemetry["battery_voltage"] = data->battery_voltage;
      itele++;
    }
      remove_first();
      message = get_first();

  }
  if(it != 0){
    String jj;
    serializeJson(doc, jj);
    jsn_body = jj;
  }

  if(itele != 0){
    String jt;
    serializeJson(tele_doc, jt);
    jsn_telemetry = jt;
  }

  if(it == 0){
    jsn_body = "";
  }

  if(itele == 0){
    jsn_telemetry = "";
  }

  data_tries = 0;
  telemetry_tries = 0;

}


long previous_interval_config = 0;
void get_measurement_interval_config(){
  if(millis() - previous_interval_config > 1000){
    String deployment_id = get_current_deployment();

    if(deployment_id.length() > 5 && WiFi.status() == WL_CONNECTED){
      long start = millis();
      String url = String(serverName) + String("/api/deployment/interval/") + deployment_id;
      Serial.println(url);
      //HTTPClient http;
      http.begin(url);
      //http.addHeader("Content-Type", "application/json");
      int httpResponseCode = http.GET();
      Serial.println(httpResponseCode);
      previous_interval_config = millis() - 500;
      if(httpResponseCode == 200){
        previous_interval_config = millis();
        String result = http.getString();
        int interval = parse_interval_config(result);
        set_measurement_interval(interval);
      }

      http.end();
      add_rtt(millis() - start);

    }
  }
}

uint8_t get_rssi(){
  return latest_rssi;
}

void add_rtt(long len){
  average_RTT[average_RTT_index][0] = len;
  average_RTT[average_RTT_index][1] = millis();
  average_RTT_index += 1;
  average_RTT_index %= 50;
}
