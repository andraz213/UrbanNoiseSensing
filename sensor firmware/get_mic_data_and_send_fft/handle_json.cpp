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


void get_gateway_mac(uint8_t * mac) {

  DynamicJsonDocument doc(5000);

  String json = get_config();

  if(json.length() != 0){
    deserializeJson(doc, json);
    if(doc.size() > 0){

      JsonObject root = doc[0];
      if(!root["gateways"].isNull()){
        JsonArray root_mac_gateways = root["gateways"];
        if(root_mac_gateways.size() > 0){
          JsonArray gateways_0 = root_mac_gateways[0];

          if(!root_mac_gateways.isNull() && root_mac_gateways.size() == 1 && root_mac_gateways[0].size() == 6){
            for (int i = 0; i < 6; i++) {
              mac[i] = (uint8_t)gateways_0[i];
            }
            return;
          }
        }
      }
    }
  }

  for (int i = 0; i < 6; i++) {
    mac[i] = (uint8_t)255;
  }
  return;


}


String get_sensor_id() {

  DynamicJsonDocument doc(5000);

  String json = get_config();
  deserializeJson(doc, json);

  JsonObject root = doc[0];

  const char* root_id = root["_id"];
  Serial.println(String(root_id));
  return String(root_id); // "Madelyn84"
}




/*
  const size_t capacity = JSON_ARRAY_SIZE(0) + 2*JSON_ARRAY_SIZE(1) + JSON_ARRAY_SIZE(2) + JSON_ARRAY_SIZE(6) + 9*JSON_ARRAY_SIZE(8) + JSON_OBJECT_SIZE(9) + 190;
  DynamicJsonDocument doc(capacity);

  const char* json = "[{\"mac\":[60,113,191,240,95,116],\"deployments\":[\"5f4e22b47ad82e002373143d\"],\"all_data\":[],\"_id\":\"5f4e0f5e7ad82e0023731436\",\"name\":\"Madelyn84\",\"__v\":1,\"current_deployment\":\"5f4e22b47ad82e002373143d\",\"current_location\":[46.03470499512917,14.558215251833886],\"gateways\":[[12,314,422,234,123,234,13,2],[12,314,422,234,123,234,13,2],[12,314,422,234,123,234,13,2],[12,314,422,234,123,234,13,2],[12,314,422,234,123,234,13,2],[12,314,422,234,123,234,13,2],[12,314,422,234,123,234,13,2],[12,314,422,234,123,234,13,2]]}]";

  deserializeJson(doc, json);

  JsonObject root_0 = doc[0];

  JsonArray root_0_mac = root_0["mac"];
  int root_0_mac_0 = root_0_mac[0]; // 60
  int root_0_mac_1 = root_0_mac[1]; // 113
  int root_0_mac_2 = root_0_mac[2]; // 191
  int root_0_mac_3 = root_0_mac[3]; // 240
  int root_0_mac_4 = root_0_mac[4]; // 95
  int root_0_mac_5 = root_0_mac[5]; // 116

  const char* root_0_deployments_0 = root_0["deployments"][0]; // "5f4e22b47ad82e002373143d"

  const char* root_0__id = root_0["_id"]; // "5f4e0f5e7ad82e0023731436"
  const char* root_0_name = root_0["name"]; // "Madelyn84"
  int root_0__v = root_0["__v"]; // 1
  const char* root_0_current_deployment = root_0["current_deployment"]; // "5f4e22b47ad82e002373143d"

  float root_0_current_location_0 = root_0["current_location"][0]; // 46.03470499512917
  float root_0_current_location_1 = root_0["current_location"][1]; // 14.558215251833886

  JsonArray root_0_gateways = root_0["gateways"];

  JsonArray root_0_gateways_0 = root_0_gateways[0];
  int root_0_gateways_0_0 = root_0_gateways_0[0]; // 12
  int root_0_gateways_0_1 = root_0_gateways_0[1]; // 314
  int root_0_gateways_0_2 = root_0_gateways_0[2]; // 422
  int root_0_gateways_0_3 = root_0_gateways_0[3]; // 234
  int root_0_gateways_0_4 = root_0_gateways_0[4]; // 123
  int root_0_gateways_0_5 = root_0_gateways_0[5]; // 234
  int root_0_gateways_0_6 = root_0_gateways_0[6]; // 13
  int root_0_gateways_0_7 = root_0_gateways_0[7]; // 2

  JsonArray root_0_gateways_1 = root_0_gateways[1];
  int root_0_gateways_1_0 = root_0_gateways_1[0]; // 12
  int root_0_gateways_1_1 = root_0_gateways_1[1]; // 314
  int root_0_gateways_1_2 = root_0_gateways_1[2]; // 422
  int root_0_gateways_1_3 = root_0_gateways_1[3]; // 234
  int root_0_gateways_1_4 = root_0_gateways_1[4]; // 123
  int root_0_gateways_1_5 = root_0_gateways_1[5]; // 234
  int root_0_gateways_1_6 = root_0_gateways_1[6]; // 13
  int root_0_gateways_1_7 = root_0_gateways_1[7]; // 2

  JsonArray root_0_gateways_2 = root_0_gateways[2];
  int root_0_gateways_2_0 = root_0_gateways_2[0]; // 12
  int root_0_gateways_2_1 = root_0_gateways_2[1]; // 314
  int root_0_gateways_2_2 = root_0_gateways_2[2]; // 422
  int root_0_gateways_2_3 = root_0_gateways_2[3]; // 234
  int root_0_gateways_2_4 = root_0_gateways_2[4]; // 123
  int root_0_gateways_2_5 = root_0_gateways_2[5]; // 234
  int root_0_gateways_2_6 = root_0_gateways_2[6]; // 13
  int root_0_gateways_2_7 = root_0_gateways_2[7]; // 2

  JsonArray root_0_gateways_3 = root_0_gateways[3];
  int root_0_gateways_3_0 = root_0_gateways_3[0]; // 12
  int root_0_gateways_3_1 = root_0_gateways_3[1]; // 314
  int root_0_gateways_3_2 = root_0_gateways_3[2]; // 422
  int root_0_gateways_3_3 = root_0_gateways_3[3]; // 234
  int root_0_gateways_3_4 = root_0_gateways_3[4]; // 123
  int root_0_gateways_3_5 = root_0_gateways_3[5]; // 234
  int root_0_gateways_3_6 = root_0_gateways_3[6]; // 13
  int root_0_gateways_3_7 = root_0_gateways_3[7]; // 2

  JsonArray root_0_gateways_4 = root_0_gateways[4];
  int root_0_gateways_4_0 = root_0_gateways_4[0]; // 12
  int root_0_gateways_4_1 = root_0_gateways_4[1]; // 314
  int root_0_gateways_4_2 = root_0_gateways_4[2]; // 422
  int root_0_gateways_4_3 = root_0_gateways_4[3]; // 234
  int root_0_gateways_4_4 = root_0_gateways_4[4]; // 123
  int root_0_gateways_4_5 = root_0_gateways_4[5]; // 234
  int root_0_gateways_4_6 = root_0_gateways_4[6]; // 13
  int root_0_gateways_4_7 = root_0_gateways_4[7]; // 2

  JsonArray root_0_gateways_5 = root_0_gateways[5];
  int root_0_gateways_5_0 = root_0_gateways_5[0]; // 12
  int root_0_gateways_5_1 = root_0_gateways_5[1]; // 314
  int root_0_gateways_5_2 = root_0_gateways_5[2]; // 422
  int root_0_gateways_5_3 = root_0_gateways_5[3]; // 234
  int root_0_gateways_5_4 = root_0_gateways_5[4]; // 123
  int root_0_gateways_5_5 = root_0_gateways_5[5]; // 234
  int root_0_gateways_5_6 = root_0_gateways_5[6]; // 13
  int root_0_gateways_5_7 = root_0_gateways_5[7]; // 2

  JsonArray root_0_gateways_6 = root_0_gateways[6];
  int root_0_gateways_6_0 = root_0_gateways_6[0]; // 12
  int root_0_gateways_6_1 = root_0_gateways_6[1]; // 314
  int root_0_gateways_6_2 = root_0_gateways_6[2]; // 422
  int root_0_gateways_6_3 = root_0_gateways_6[3]; // 234
  int root_0_gateways_6_4 = root_0_gateways_6[4]; // 123
  int root_0_gateways_6_5 = root_0_gateways_6[5]; // 234
  int root_0_gateways_6_6 = root_0_gateways_6[6]; // 13
  int root_0_gateways_6_7 = root_0_gateways_6[7]; // 2

  JsonArray root_0_gateways_7 = root_0_gateways[7];
  int root_0_gateways_7_0 = root_0_gateways_7[0]; // 12
  int root_0_gateways_7_1 = root_0_gateways_7[1]; // 314
  int root_0_gateways_7_2 = root_0_gateways_7[2]; // 422
  int root_0_gateways_7_3 = root_0_gateways_7[3]; // 234
  int root_0_gateways_7_4 = root_0_gateways_7[4]; // 123
  int root_0_gateways_7_5 = root_0_gateways_7[5]; // 234
  int root_0_gateways_7_6 = root_0_gateways_7[6]; // 13
  int root_0_gateways_7_7 = root_0_gateways_7[7]; // 251833886

*/
