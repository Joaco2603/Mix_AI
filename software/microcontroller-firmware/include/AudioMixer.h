#ifndef AUDIO_MIXER_H
#define AUDIO_MIXER_H

#include "BufferedTrack.h"
#include "MixerChannel.h"
#include <array>


class AudioMixer {
private:
    static constexpr int MAX_TRACKS = 4;
    std::array<MixerChannel, MAX_TRACKS> channels;
public:
    // Primary functions
    void begin();
    const BufferedTrack& getTrack(int channel) const;
    
    // Mixer function
    size_t mix(int16_t* outBuffer, size_t numSamples);

    // Channel management
    int addTrack(const char* filename, float gain = 1.0f);
    MixerChannel& getChannel(int index);
    const MixerChannel& getChannel(int index) const;

    std::array<MixerChannel, MAX_TRACKS> getChannels() const {return channels;};
    bool isActive() const;
};

#endif
