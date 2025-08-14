#ifndef WAV_READER_H
#define WAV_READER_H

#include <Arduino.h>
#include <FS.h>
#include <SD.h>

class WavReader {
public:
    bool open(const char* path);
    size_t readSamples(int16_t* buffer, size_t maxSamples);
    void close();
    uint16_t getNumChannels() const;
    uint32_t getSampleRate() const;

private:
    File file;
    uint16_t numChannels;
    uint32_t sampleRate;
    uint16_t bitsPerSample;
    uint32_t dataSize;
    uint32_t dataStart;

    bool parseHeader();
};

#endif
