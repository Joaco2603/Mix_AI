#ifndef BUFFERED_TRACK_H
#define BUFFERED_TRACK_H

#include "WavReader.h"

class BufferedTrack
{
public:
    bool open(const char *path);
    size_t getSamples(int16_t *buffer, size_t numSamples);
    bool isActive() const;
    void refill();
    void setGain(float g) { gain = g; }
    float getGain() const { return gain; }
    float gain = 1.0f;

private:
    WavReader reader;
    static const size_t BUFFER_SIZE = 2048;
    int16_t internalBuffer[BUFFER_SIZE];
    size_t bufferIndex = 0;
    size_t bufferFill = 0;
    int muted = 0;
    bool active = false;
};

#endif
