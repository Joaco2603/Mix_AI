#ifndef AUDIO_MIXER_H
#define AUDIO_MIXER_H

#include "BufferedTrack.h"

class AudioMixer {
public:
    void begin();
    int addTrack(const char* filename, float gain = 1.0f);
    void setChannelVolume(int channel, float gain);
    const BufferedTrack& getTrack(int channel) const;
    bool isActive() const;
    size_t mix(int16_t* outBuffer, size_t numSamples);

private:
    struct Track {
        BufferedTrack track;
        float gain = 1.0f;
        bool isActive = false;
    };

    static const int MAX_TRACKS = 4;
    Track tracks[MAX_TRACKS];
    int trackCount = 0;
};

#endif
