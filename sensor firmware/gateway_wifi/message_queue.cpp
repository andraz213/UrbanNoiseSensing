#include "message_queue.h"
#include <arduino.h>




message_queue* first_item = 0;
message_queue* last_item;
message_queue* free_pool;
int in_list = 0;
int free_size = 0;




void init_sending_queue() {
  message_queue *pool;
  pool = (message_queue*)heap_caps_malloc(sizeof(message_queue) * 64, MALLOC_CAP_8BIT);

  for (int i = 0; i < 64; i++) {
    pool[i].next = free_pool;
    free_pool = &pool[i];
  }
}



void need_free_items() {
  if (heap_caps_get_free_size(MALLOC_CAP_8BIT) < 50000) {
    remove_first();
    Serial.println((unsigned long) first_item);
  } else {
    init_sending_queue();
  }
}


message_queue * get_one_free_item_and_add_to_queue() {
  message_queue *new_item = free_pool;
  free_pool = (message_queue*)new_item->next;
  return new_item;
}


void put_item_into_queue(message_queue * new_item) {
  if (!first_item) {
    first_item = new_item;
    last_item = new_item;
  } else {
    last_item->next = new_item;
    last_item = new_item;
  }

  last_item->next = (message_queue*)0;
}




void add_to_message_queue(char* message, int len, char *mac) {
  if (!free_pool) {
    need_free_items();
  }

  message_queue *new_item = get_one_free_item_and_add_to_queue();

  char* mess = (char*)heap_caps_malloc(sizeof(char) * len, MALLOC_CAP_8BIT);
  memcpy(mess, message, len);
  memcpy(new_item->mac, mac, 6);
  new_item->message = mess;
  new_item->len = len;



  new_item->next = (message_queue*)0;

  put_item_into_queue(new_item);

  in_list++;
}



message_queue * get_first() {
  return (message_queue *)first_item;
}



void remove_first() {
  if (first_item) {
    in_list --;
    free(first_item->message);
    message_queue* second = (message_queue*)first_item->next;
    first_item->next = free_pool;
    free_pool = first_item;
    first_item = second;
  }
}
