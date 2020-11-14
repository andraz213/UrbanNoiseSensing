#include "handle_json.h"



String get_config_name() {

  DynamicJsonDocument doc(5000);

  String json = get_config();
  if(json.length() > 0){
    deserializeJson(doc, json);
    if(doc.size() > 0){
      JsonObject root = doc[0];
      if(!root["name"].isNull()){
        const char* root_0_name = root["name"];

        Serial.println(String(root_0_name));
        return String(root_0_name); // "Madelyn84"
      }
    }
  }

  return String("not inited");
}



String get_current_deployment(){
DynamicJsonDocument doc(5000);
  String json = get_config();
  if(json.length() > 0){
    deserializeJson(doc, json);
    if(doc.size() > 0){
      JsonObject root = doc[0];
      if(!root["current_deployment"].isNull()){
        const char* current_deployment = root["current_deployment"];
        String res = String(current_deployment);
        return res; // "Madelyn84"
      }
    }
  }

  return String("");
}


int parse_interval_config(String json){

  DynamicJsonDocument doc(5000);
    if(json.length() > 0){
      deserializeJson(doc, json);
      if(doc.size() > 0){
        if(!doc["measurement_interval"].isNull()){
          int interval = doc["measurement_interval"];

          Serial.println(interval);
          return interval; // "Madelyn84"
        }
      }
    }
    return 1;
}



String check_wifi_credentials(String current){

  DynamicJsonDocument doc(5000);
  String json = get_config();
  Serial.println(json);
    if(json.length() > 0){
      deserializeJson(doc, json);
      if(doc.size() > 0){
        JsonObject root = doc[0];
        if(!root["wifi_credentials"].isNull()){
          Serial.println("BRUW");
          JsonArray wifi_credentials = root["wifi_credentials"];
          int len = wifi_credentials.size();
          Serial.println("BRUW");
          Serial.println(len);
          if(len == 2){
              const char* ssid = wifi_credentials[0];
              const char* password = wifi_credentials[1];
              Serial.println(ssid);
              Serial.println(password);
              if(String(ssid).equals(current)){
                return String(password);
              }

            }
          }
        }
    }

    return String("");
}







/*

JsonArray mac = doc["mac"];
int mac_0 = mac[0]; // 48
int mac_1 = mac[1]; // 174
int mac_2 = mac[2]; // 164
int mac_3 = mac[3]; // 150
int mac_4 = mac[4]; // 144
int mac_5 = mac[5]; // 148

JsonArray deployments = doc["deployments"];
const char* deployments_0 = deployments[0]; // "5f75caaf535f2e0541958386"
const char* deployments_1 = deployments[1]; // "5f760bbac3a1ea2b750cc185"
const char* deployments_2 = deployments[2]; // "5f7610d6c3a1ea2b750cf137"
const char* deployments_3 = deployments[3]; // "5f75dfce535f2e054195838b"
const char* deployments_4 = deployments[4]; // "5f75a4eb4d10b0bde82cf805"

JsonArray wifi_credentials = doc["wifi_credentials"];

const char* wifi_credentials_0_0 = wifi_credentials[0][0]; // "324"
const char* wifi_credentials_0_1 = wifi_credentials[0][1]; // "dasf"

const char* wifi_credentials_1_0 = wifi_credentials[1][0]; // "324"
const char* wifi_credentials_1_1 = wifi_credentials[1][1]; // "dasf"

const char* wifi_credentials_2_0 = wifi_credentials[2][0]; // "324"
const char* wifi_credentials_2_1 = wifi_credentials[2][1]; // "dasf"

int current_location_0 = doc["current_location"][0]; // 0
int current_location_1 = doc["current_location"][1]; // 0

const char* _id = doc["_id"]; // "5f75c82d535f2e0541958382"
const char* name = doc["name"]; // "Mila33"
int _v = doc["__v"]; // 5
const char* current_deployment = doc["current_deployment"]; // "5f75a4eb4d10b0bde82cf805"

*/
