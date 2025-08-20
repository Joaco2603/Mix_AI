#include "BufferedTrack.h"

#include <cstring>
#include <iostream>


bool BufferedTrack::open(const char* path) {
    active = reader.open(path);
    bufferIndex = 0;
    bufferFill = 0;
    refill();
    return active;
}

void BufferedTrack::refill() {
    if (!active) return;

    bufferFill = reader.readSamples(internalBuffer, BUFFER_SIZE);
    bufferIndex = 0;

    if (bufferFill == 0) {
        // Llegamos al final: ponemos ceros para evitar basura
        std::memset(internalBuffer, 0, BUFFER_SIZE * sizeof(int16_t));
        active = false;
    }
}


size_t BufferedTrack::getSamples(int16_t* buffer, size_t numSamples) {
    if (!active || !buffer || !internalBuffer) return 0;
    
    size_t samplesRead = 0;
    while (samplesRead < numSamples && active) {
        if (bufferIndex >= bufferFill) {
            refill();
        }

        buffer[samplesRead++] = internalBuffer[bufferIndex++];
    }
    return samplesRead;
}


bool BufferedTrack::isActive() const {
    return active;
}
