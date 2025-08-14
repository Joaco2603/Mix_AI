#include <M5GFX.h>

#include "AudioMixer.h"

extern M5GFX display;

void AudioMixer::begin()
{
    trackCount = 0;
    for (int i=0;i<MAX_TRACKS;i++){
        tracks[i].isActive = false;
        tracks[i].gain = 1.0f;
    }
}

int AudioMixer::addTrack(const char* filename, float gain)
{
    if (!filename) {
        printf("ERROR: filename is NULL\n");
        return -1;
    }

    if (trackCount >= MAX_TRACKS) {
        printf("ERROR: too many tracks\n");
        return -1;
    }

    printf("Opening track at index %d\n", trackCount);
    bool success = tracks[trackCount].track.open(filename);
    printf("Track open result: %s\n", success ? "success" : "failed");

    if (!success) return -1;

    // **Asignar antes de devolver**
    tracks[trackCount].gain = gain;
    tracks[trackCount].isActive = true;

    int assignedIndex = trackCount;
    trackCount++;
    return assignedIndex;
}

void AudioMixer::setChannelVolume(int channel, float gain)
{
    if (channel < 0 || channel >= MAX_TRACKS) {
        printf("ERROR: Canal fuera de rango\n");
        return;
    }

    // Mejor debug: imprime 'this' y la dirección de tracks
    Serial.printf("setChannelVolume this=%p tracks=%p channel=%d\n",
                  (void*)this, (void*)tracks, channel);

    tracks[channel].gain = gain;
}

size_t AudioMixer::mix(int16_t *outBuffer, size_t numSamples)
{
    Serial.printf("mix this=%p tracks=%p trackCount=%d\n",
                  (void*)this, (void*)tracks, trackCount);

    if (!outBuffer || numSamples == 0)
        return 0;

    // Usar calloc-like behaviour
    memset(outBuffer, 0, sizeof(int16_t) * numSamples);

    bool hasActiveAudio = false;
    // Evitar new/delete en cada iteración si podés; pero dejo igual por claridad
    for (int i = 0; i < trackCount; ++i)
    {
        if (!tracks[i].isActive)
            continue;

        int16_t *temp = new int16_t[numSamples];
        size_t read = tracks[i].track.getSamples(temp, numSamples);

        if (read > 0)
        {
            hasActiveAudio = true;

            for (size_t j = 0; j < read; ++j)
            {
                // aplicar ganancia en float con saturación
                int32_t sample = (int32_t)( (float)temp[j] * tracks[i].gain );
                int32_t mixed = (int32_t)outBuffer[j] + sample;

                if (mixed > 32767) mixed = 32767;
                if (mixed < -32768) mixed = -32768;

                outBuffer[j] = (int16_t)mixed;
            }
        }

        delete[] temp;
    }
    return hasActiveAudio ? numSamples : 0;
}

bool AudioMixer::isActive() const
{
    for (int i = 0; i < trackCount; ++i)
    {
        if (tracks[i].isActive)
            return true;
    }
    return false;
}