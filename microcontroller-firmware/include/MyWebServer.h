#ifndef SERVER_H
#define SERVER_H
#include "AudioMixer.h"
#include "AudioPlayer.h"

class MyWebServer {
public:
  void start(AudioMixer *mixer, AudioPlayer *player);
};

#endif
