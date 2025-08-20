// BufferedTrack.cpp
// ---------------------------------------------------------------------------
// Documentacion (es):
// Implementa un envoltorio con buffer para lecturas de muestras desde un
// `WavReader` o fuente similar. Mantiene un buffer interno para reducir
// accesos a disco y ofrece `getSamples` para consumir muestras de forma
// secuencial.
// Contrato:
//  - open(path): abre el archivo y rellena el buffer inicial.
//  - getSamples(buffer, numSamples): copia hasta `numSamples` muestras en
//    `buffer` y retorna la cantidad real.
// Casos borde:
//  - Si se alcanza el final del archivo se devuelven ceros y `active=false`.
//  - Devuelve 0 si no hay datos o si los punteros son nulos.
// ---------------------------------------------------------------------------

#include "BufferedTrack.h"

#include <cstring>
#include <iostream>


bool BufferedTrack::open(const char* path) {
    active = reader.open(path);
    bufferIndex = 0;
    bufferFill = 0;
    // Rellenar buffer inicial para estar listos para la reproducción
    refill();
    return active;
}

// Llena el buffer interno desde el lector. Si no quedan muestras marca
// `active=false` y llena el buffer con ceros para evitar ruido.
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


// Copia `numSamples` muestras al buffer proporcionado. Retorna numero real
// de muestras copiadas (puede ser menor si se llega al final).
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
