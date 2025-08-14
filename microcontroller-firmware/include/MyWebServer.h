#ifndef SERVER_H
#define SERVER_H
#include "AudioMixer.h"

class MyWebServer {
public:
  void start(AudioMixer *mixer);
};

#endif
