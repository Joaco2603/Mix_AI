#ifndef MIXER_CHANNEL_H
#define MIXER_CHANNEL_H

#include "BufferedTrack.h"

class MixerChannel {
public:
    MixerChannel() = default;

    bool load(const char* filename, float initialGain = 1.0f);
    size_t readSamples(int16_t* buffer, size_t numSamples);

    // --- Volumen ---
    void setGain(float g);
    float getGain() const;

    // --- Estado de mute ---
    void setMuted(bool m);
    bool isMuted() const;

    // --- Estado de actividad ---
    bool isActive() const;
    const BufferedTrack& getTrack() const;

private:
    BufferedTrack track;
    float gain = 1.0f;
    bool muted = false;
    bool active = false;
};

#endif
