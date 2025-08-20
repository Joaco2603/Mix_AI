// AudioMixer.cpp
// ---------------------------------------------------------------------------
// Documentacion (es):
// Responsable de mezclar varias pistas (MixerChannel) en un buffer de salida
// utilizado por el `AudioPlayer` para enviar datos por I2S.
// Contrato:
//  - begin(): inicializacion ligera (no reserva de memoria pesada).
//  - addTrack(filename, gain): carga un archivo WAV en un canal libre, devuelve
//    el índice del canal o -1 si no hay espacio/errores.
//  - mix(outBuffer, numSamples): escribe `numSamples` muestras mezcladas en
//    `outBuffer`. Retorna el numero de muestras procesadas (normalmente
//    igual a numSamples). El buffer debe tener espacio suficiente.
// Casos borde:
//  - Si no hay canales activos, se escribe ceros.
//  - Si canales devuelven menos muestras que `numSamples`, el resto queda
//    sin modificar (aqui inicializamos a 0 antes de mezclar para seguridad).
// ---------------------------------------------------------------------------

#include <M5GFX.h>

#include "AudioMixer.h"
#include <cstring>

extern M5GFX display;

void AudioMixer::begin() {}

// Intenta cargar un archivo en el primer canal inactivo.
// Retorna el Índice del canal cargado o -1 en caso de fallo.
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
// Acceso mutuo al canal (para UI/configuracion)
MixerChannel &AudioMixer::getChannel(int index)
{
    return channels[index];
}

// Acceso de solo lectura al canal
const MixerChannel &AudioMixer::getChannel(int index) const
{
    return channels[index];
}

// Mezcla las muestras de todos los canales activos en outBuffer.
// - outBuffer: puntero a int16_t con espacio para `numSamples` muestras.
// - numSamples: cantidad de muestras mono a mezclar.
// Devuelve el numero de muestras procesadas.
size_t AudioMixer::mix(int16_t *outBuffer, size_t numSamples)
{
    // Inicializar salida a cero para seguridad si algún canal lee menos
    std::memset(outBuffer, 0, numSamples * sizeof(int16_t));

    for (auto &channel : channels)
    {
        if (channel.isActive())
        {
            int16_t tempBuffer[512];
            size_t samplesRead = channel.readSamples(tempBuffer, numSamples);

            for (size_t i = 0; i < samplesRead; i++)
            {
                // Aplicar ganancia del canal solo si no está silenciado
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

// Indica si al menos un canal está activo
bool AudioMixer::isActive() const
{
    for (const auto &channel : channels)
    {
        if (channel.isActive())
            return true;
    }
    return false;
}