#ifndef MESSAGE_QUEUE_H
#define MESSAGE_QUEUE_H

typedef struct  {
  void * next;
  char mac[6];
  int len;
  char* message;
} message_queue;


void add_to_message_queue(char* message, int len, char *mac);
message_queue * get_first();
void remove_first();


#endif
