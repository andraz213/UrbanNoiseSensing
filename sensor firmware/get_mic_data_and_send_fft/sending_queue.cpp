#include "global_defines.h"
#include "sending_queue.h"
#include <arduino.h>


typedef struct  {
  void * next;
  double fft_values [DOWNSAMPLED__FFT];
  int fft_range;
  double decibels;
  long timestamp;
} sending_list;


sending_list* first_item;
sending_list* last_item;
sending_list* free_pool;


void init_sending_queue(){
  sending_list *pool;
  pool = (sending_list*)heap_caps_malloc(sizeof(sending_list) * 64, MALLOC_CAP_8BIT);

  for(int i = 0; i<64; i++){
    pool[i].next = free_pool;
    free_pool = &pool[i];
  }
}



void need_free_items(){
  if(heap_caps_get_free_size(MALLOC_CAP_8BIT) < 50000){
    remove_first();
    Serial.println((unsigned long) first_item);
  } else {
    init_sending_queue();
  }
}


sending_list * get_one_free_item_and_add_to_queue(){
  sending_list *new_item = free_pool;
  free_pool = (sending_list*)new_item->next;
  return new_item;
}


void put_item_into_queue(sending_list * new_item){
  if (!first_item){
    first_item = new_item;
    last_item = new_item;
  } else {
    last_item->next = new_item;
    last_item = new_item;
  }

  last_item->next = (sending_list*)0;
}




void add_to_sending_queue(double* fft, double decibels, long timestamp){
  if(!free_pool){
    need_free_items();
  }
  sending_list *new_item = get_one_free_item_and_add_to_queue();

  for(int i = 0; i< DOWNSAMPLED__FFT; i++){
    new_item->fft_values[i] = fft[i];
  }
  new_item->next = (sending_list*)0;
  new_item->fft_range = DOWNSAMPLED_FREQUENCY;
  new_item->decibels = decibels;
  new_item->timestamp = timestamp;

  put_item_into_queue(new_item);

}



void * get_first(){
  return first_item;
}



void remove_first(){
  if(first_item){
    sending_list* second = (sending_list*)first_item->next;
    first_item->next = free_pool;
    free_pool = first_item;
    first_item = second;
  }
}
