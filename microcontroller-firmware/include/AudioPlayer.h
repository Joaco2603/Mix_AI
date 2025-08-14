// AudioPlayer.h
#ifndef AUDIOPLAYER_H
#define AUDIOPLAYER_H

// #include "Audio.h"
#include "AudioMixer.h"
#include <SD.h>
#include <SPI.h>

class AudioPlayer
{
private:
    // Audio *audio;
    bool isPlaying;
    int currentVolume;
    String currentFile;

    AudioMixer* mixer = nullptr;
    int16_t outputBuffer[512];

    
    public:
    AudioPlayer();
    
    void setMixer(AudioMixer* mixer);

    bool begin();
    bool playMixedFiles(const char* f1, const char* f2, const char* f3);
    
    void setVolume(int volume); // 0-21
    void volumeUp();
    void volumeDown();
    int getVolume();
    
    bool isCurrentlyPlaying();
    String getCurrentFile();

    void writeToI2S(int16_t* buffer, size_t samples);
    
    void update();
};

#endif