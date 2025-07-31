// AudioPlayer.h
#ifndef AUDIOPLAYER_H
#define AUDIOPLAYER_H

#include "Audio.h"
#include <SD.h>

class AudioPlayer
{
private:
    Audio *audio;
    bool isPlaying;
    int currentVolume;
    String currentFile;

public:
    AudioPlayer();
    ~AudioPlayer();

    bool begin();
    bool playFile(const char *filename);
    void stop();
    void pause();
    void resume();
    void togglePlayPause();

    void setVolume(int volume); // 0-21
    void volumeUp();
    void volumeDown();
    int getVolume();

    bool isCurrentlyPlaying();
    String getCurrentFile();

    void update(); // Llamar en loop()
};

#endif