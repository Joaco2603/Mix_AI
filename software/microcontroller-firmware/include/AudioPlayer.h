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
    bool isPlaying = true;
    bool isMuted = false;
    int currentVolume;
    String currentFile;

    AudioMixer *mixer = nullptr;
    int16_t outputBuffer[512];

public:
    AudioPlayer();

    void setMixer(AudioMixer *mixer);

    bool begin();

    template <int N>
    bool playMixedFiles(const char *(&files)[N])
    {
        if (!mixer)
        {
            Serial.println("[Error] mixer no inicializado");
            return false;
        }

        mixer->begin();

        for (int i = 0; i < N; i++)
        {
            mixer->addTrack(files[i], 1.0f);
        }

        isPlaying = true;
        return true;
    }

    int setMasterVolume(float volume);
    bool pause(bool p);
    bool mute(bool mute);
    int getVolume();
    bool getIsMuted();

    bool isCurrentlyPlaying();

    void writeToI2S(int16_t *buffer, size_t samples, int volumen);

    void update();
};

#endif