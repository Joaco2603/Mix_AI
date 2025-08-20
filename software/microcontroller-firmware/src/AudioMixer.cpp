#include <M5GFX.h>

#include "AudioMixer.h"
#include <cstring>

extern M5GFX display;

void AudioMixer::begin() {}

int AudioMixer::addTrack(const char *filename, float gain)
{
    for (int i = 0; i < MAX_TRACKS; i++)
    {
        if (!channels[i].isActive())
        {
            if (channels[i].load(filename, gain))
            {
                return i;
            }
            return -1;
        }
    }
    return -1;
}

MixerChannel &AudioMixer::getChannel(int index)
{
    return channels[index];
}

const MixerChannel &AudioMixer::getChannel(int index) const
{
    return channels[index];
}

size_t AudioMixer::mix(int16_t *outBuffer, size_t numSamples)
{
    std::memset(outBuffer, 0, numSamples * sizeof(int16_t));

    for (auto &channel : channels)
    {
        if (channel.isActive())
        {
            int16_t tempBuffer[512];
            size_t samplesRead = channel.readSamples(tempBuffer, numSamples);

            for (size_t i = 0; i < samplesRead; i++)
            {
                int32_t mixed = outBuffer[i] + static_cast<int32_t>(tempBuffer[i] * (!channel.isMuted() ? channel.getGain(): 0.0f));
                if (mixed > INT16_MAX)
                    mixed = INT16_MAX;
                if (mixed < INT16_MIN)
                    mixed = INT16_MIN;
                outBuffer[i] = static_cast<int16_t>(mixed);
            }
        }
    }
    return numSamples;
}

bool AudioMixer::isActive() const
{
    for (const auto &channel : channels)
    {
        if (channel.isActive())
            return true;
    }
    return false;
}