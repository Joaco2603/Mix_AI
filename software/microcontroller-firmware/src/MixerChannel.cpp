#include "MixerChannel.h"

bool MixerChannel::load(const char* filename, float initialGain) {
    if (!track.open(filename)) {
        active = false;
        return false;
    }
    gain = initialGain;
    active = true;
    muted = false;
    return true;
}

size_t MixerChannel::readSamples(int16_t* buffer, size_t numSamples) {
    if (!active) return 0;
    return track.getSamples(buffer, numSamples);
}

void MixerChannel::setGain(float g) {
    gain = g;
}

float MixerChannel::getGain() const {
    return gain;
}

void MixerChannel::setMuted(bool m) {
    muted = m;
}

bool MixerChannel::isMuted() const {
    return muted;
}

bool MixerChannel::isActive() const {
    return active;
}

const BufferedTrack& MixerChannel::getTrack() const {
    return track;
}
