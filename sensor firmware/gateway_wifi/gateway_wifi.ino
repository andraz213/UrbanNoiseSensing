#include "handle_telemetry.h"
#include "handle_oled.h"
#include "handle_wifi.h"
#include "handle_serial.h"
#include "handle_json.h"

long last_wifi = 0;

void setup() {
  // put your setup code here, to run once:

  Serial.begin(115200);
  Serial2.begin(921600);
  Serial2.setRxBufferSize(1024);

  oled_off();
  delay(10);
  oled_on;
  delay(10);

  setCpuFrequencyMhz(240);

  // init two tasks

  xTaskCreatePinnedToCore(
    TaskConnectWifi
    ,  "TaskConnectWifi"
    ,  12000  // Stack size
    ,  NULL
    ,  1  // Priority
    ,  NULL
    ,  1);


  xTaskCreatePinnedToCore(
    TaskOled
    ,  "OledTask"
    ,  6000  // Stack size
    ,  NULL
    ,  1  // Priority
    ,  NULL,
    1);


  // task two
  xTaskCreatePinnedToCore(
    TaskSerial
    ,  "TaskSerial"
    ,  32000  // Stack size
    ,  NULL
    ,  1  // Priority
    ,  NULL,
    1);

  // task one
  xTaskCreatePinnedToCore(
    TaskWifi
    ,  "TaskWifi"
    ,  32000  // Stack size
    ,  NULL
    ,  1  // Priority
    ,  NULL,
    0);




}
long prev_display = 0;

long rammm = 0;

void loop() {
  vTaskDelay(10000);

  vTaskDelay(30000);

}





void TaskOled( void *pvParameters ) {

  Serial.println("Oled Task");
  int n_zaporednih = 0;
  long prev = 0;
  for (;;) {
    prev = millis();
    if(heap_caps_get_free_size(MALLOC_CAP_8BIT) < 50000){
      n_zaporednih += 1;
      if(n_zaporednih > 60){
        ESP.restart();
      }
    } else {
      n_zaporednih = 0;
    }
    Serial.println("-----------------------taskOled");
    int rtt_avg = get_RTT_average();
    String name = get_config_name();
    long ram = heap_caps_get_free_size(MALLOC_CAP_8BIT);
    ram /= 1000;
    String rams = String(ram) + "kB";
    print_text(name, String("Averge RTT: " + String(rtt_avg)), String(String("Alive ") + String((int(millis() / 1000))) + String("s ") + String(rams) ), String(String("WiFi: ")+ get_ssid() + " (" + String((int)get_rssi() - 255) + ")"));
    //delay(10);
    Serial.println(get_ssid());


    set_wifi_RTT(rtt_avg);
    set_wifi_ram((int) heap_caps_get_free_size(MALLOC_CAP_8BIT));
    set_wifi_alive((long)(millis() / 1000));
    set_wifi_ssid(get_ssid());
    set_wifi_rssi((int)get_rssi() - 255);
    set_wifi_messages(get_sent_in_last_second());

    long del = 333 - (millis() - prev);
    del = abs(del);

    vTaskDelay(del);


  }
}

void TaskPrintHeap( void *pvParameters ) {
  Serial.println("heap Task");
  for (;;) {
    if (heap_caps_get_free_size(MALLOC_CAP_8BIT) < 80000) {
      Serial.println(heap_caps_get_free_size(MALLOC_CAP_8BIT));
    }
    delay(100);
  }
}


void TaskConnectWifi( void *pvParameters ) {

  Serial.println("Connect Wifi Task");

  for (;;) {
    Serial.println("-----------------------taskConnectWifi");
    init_wifi();
    vTaskDelay(200);



  }
}
