#ifndef ROUTES_H
#define ROUTES_H

#include <ESPAsyncWebServer.h>
#include "AudioMixer.h"

class Routes {
  public:
    static void init(AsyncWebServer& server, AudioMixer* mixer);
};

#endif
