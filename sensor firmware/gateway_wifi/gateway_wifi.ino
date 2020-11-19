
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

  for (;;) {

    Serial.println("-----------------------taskOled");
    int rtt_avg = get_RTT_average();
    String name = get_config_name();
    print_text(name, String("Averge RTT: " + String(rtt_avg)), String(String("Alive ") + String((int(millis() / 1000))) + String("s")), String(String("Signal strength: ") + String((int)get_rssi() - 255)));
    //delay(10);
    //Serial.println(heap_caps_get_free_size(MALLOC_CAP_8BIT));
    vTaskDelay(90);



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
