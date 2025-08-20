
#include "WavReader.h"

// WavReader: lector de archivos WAV desde SD.
// Documentación (es):
// - open(path): abre el archivo en la SD y valida el header WAV llamando
//   a parseHeader(). Rellena variables internas como numChannels,
//   sampleRate y bitsPerSample.
// - readSamples(buffer, maxSamples): lee hasta `maxSamples` muestras
//   (int16_t) desde la posición actual del archivo.
// - parseHeader(): analiza chunks RIFF/WAVE, busca 'fmt ' y 'data' y
//   guarda la posición de inicio de datos.
// Casos borde:
// - Manejo de archivos corruptos o chunks desconocidos: se saltan
//   los chunks no reconocidos hasta encontrar 'fmt ' y 'data'.
// - Si faltan campos críticos, la función retorna false y el archivo
//   se considera no válido para reproducir.

bool WavReader::open(const char* path) {
    Serial.printf("Opening WAV file: %s\n", path);
    
    file = SD.open(path);
    if (!file) {
        Serial.printf("ERROR: Cannot open file %s\n", path);
        return false;
    }
    
    bool result = parseHeader();
    Serial.printf("Parse result: %s\n", result ? "SUCCESS" : "FAILED");
    Serial.printf("Final values - Channels: %u, SampleRate: %u, BitsPerSample: %u\n", 
                  numChannels, sampleRate, bitsPerSample);
    
    return result;
}

void WavReader::close() {
    if (file) file.close();
}

// Lee muestras como int16_t desde el archivo. Retorna la cantidad real
// de muestras leídas.
size_t WavReader::readSamples(int16_t* buffer, size_t maxSamples) {
    if (!file) return 0;
    return file.read((uint8_t*)buffer, maxSamples * sizeof(int16_t)) / sizeof(int16_t);
}


bool WavReader::parseHeader() {
    // Resetear valores
    numChannels = 0;
    sampleRate = 0;
    bitsPerSample = 0;
    dataSize = 0;
    
    file.seek(0); // Empezar desde el inicio
    
    // Leer RIFF header
    char riff[4];
    if (file.readBytes(riff, 4) != 4) {
        Serial.println("ERROR: Cannot read RIFF header");
        return false;
    }
    
    Serial.printf("RIFF header: %c%c%c%c\n", riff[0], riff[1], riff[2], riff[3]);
    if (strncmp(riff, "RIFF", 4) != 0) {
        Serial.println("ERROR: Not a RIFF file");
        return false;
    }
    
    // Leer file size (4 bytes)
    uint32_t fileSize;
    file.read((uint8_t*)&fileSize, 4);
    Serial.printf("File size: %u\n", fileSize);
    
    // Leer WAVE header
    char wave[4];
    if (file.readBytes(wave, 4) != 4) {
        Serial.println("ERROR: Cannot read WAVE header");
        return false;
    }
    
    Serial.printf("WAVE header: %c%c%c%c\n", wave[0], wave[1], wave[2], wave[3]);
    if (strncmp(wave, "WAVE", 4) != 0) {
        Serial.println("ERROR: Not a WAVE file");
        return false;
    }
    
    // Buscar fmt chunk
    bool fmtFound = false;
    while (file.available() && !fmtFound) {
        char chunkId[4];
        uint32_t chunkSize;
        
        if (file.readBytes(chunkId, 4) != 4) break;
        if (file.read((uint8_t*)&chunkSize, 4) != 4) break;
        
        Serial.printf("Found chunk: %c%c%c%c, size: %u\n", 
                      chunkId[0], chunkId[1], chunkId[2], chunkId[3], chunkSize);
        
        if (strncmp(chunkId, "fmt ", 4) == 0) {
            // Leer formato de audio
            uint16_t audioFormat;
            if (file.read((uint8_t*)&audioFormat, 2) != 2) break;
            Serial.printf("Audio format: %u\n", audioFormat);
            
            // Leer número de canales
            if (file.read((uint8_t*)&numChannels, 2) != 2) break;
            Serial.printf("Channels: %u\n", numChannels);
            
            // Leer sample rate
            if (file.read((uint8_t*)&sampleRate, 4) != 4) break;
            Serial.printf("Sample rate: %u\n", sampleRate);
            
            // Leer byte rate (4 bytes) - saltar
            uint32_t byteRate;
            file.read((uint8_t*)&byteRate, 4);
            
            // Leer block align (2 bytes) - saltar
            uint16_t blockAlign;
            file.read((uint8_t*)&blockAlign, 2);
            
            // Leer bits per sample
            if (file.read((uint8_t*)&bitsPerSample, 2) != 2) break;
            Serial.printf("Bits per sample: %u\n", bitsPerSample);
            
            fmtFound = true;
            
            // Saltar el resto del chunk fmt si hay más datos
            uint32_t bytesRead = 16; // Audio format + channels + sample rate + byte rate + block align + bits per sample
            if (chunkSize > bytesRead) {
                file.seek(file.position() + (chunkSize - bytesRead));
            }
        } else {
            // Saltar chunk desconocido
            file.seek(file.position() + chunkSize);
        }
    }
    
    if (!fmtFound) {
        Serial.println("ERROR: fmt chunk not found");
        return false;
    }
    
    // Buscar data chunk
    file.seek(12); // Volver después del header RIFF/WAVE
    bool dataFound = false;
    
    while (file.available() && !dataFound) {
        char chunkId[4];
        uint32_t chunkSize;
        
        if (file.readBytes(chunkId, 4) != 4) break;
        if (file.read((uint8_t*)&chunkSize, 4) != 4) break;
        
        if (strncmp(chunkId, "data", 4) == 0) {
            dataSize = chunkSize;
            dataStart = file.position(); // Guardar posición donde empiezan los datos
            Serial.printf("Data chunk found: size=%u, start=%u\n", dataSize, dataStart);
            dataFound = true;
        } else {
            // Saltar chunk
            file.seek(file.position() + chunkSize);
        }
    }
    
    if (!dataFound) {
        Serial.println("ERROR: data chunk not found");
        return false;
    }
    
    // Posicionar al inicio de los datos
    file.seek(dataStart);
    
    // Verificar que los valores sean válidos
    if (numChannels == 0 || sampleRate == 0 || bitsPerSample == 0) {
        Serial.println("ERROR: Invalid WAV parameters");
        return false;
    }
    
    return true;
}