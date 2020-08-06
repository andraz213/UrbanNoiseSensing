#ifndef MESSAGE_QUEUE_H
#define MESSAGE_QUEUE_H
#include "global_defines.h"


void add_to_message_queue(char* message, int len, char *mac);
message_queue * get_first();
void remove_first();


#endif
