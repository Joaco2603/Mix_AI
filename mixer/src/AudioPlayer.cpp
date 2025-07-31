// AudioPlayer.cpp
#include <M5GFX.h>
#include "AudioPlayer.h"

// Configuración de pines I2S para M5Stack
#define I2S_DOUT      2
#define I2S_BCLK      12  
#define I2S_LRC       0


extern M5GFX display;


AudioPlayer::AudioPlayer() {
    audio = nullptr;
    isPlaying = false;
    currentVolume = 15; // Volumen medio
    currentFile = "";
}

AudioPlayer::~AudioPlayer() {
    if (audio) {
        delete audio;
    }
}

bool AudioPlayer::begin() {
    // Crear objeto Audio
    audio = new Audio();
    
    // Configurar pines I2S
    audio->setPinout(I2S_BCLK, I2S_LRC, I2S_DOUT);
    
    // Configurar volumen inicial
    audio->setVolume(15);
    
    Serial.println("AudioPlayer inicializado correctamente");
    return true;
}

bool AudioPlayer::playFile(const char* filename) {
    if (!audio) {
        display.println("Error: Audio no inicializado");
        return false;
    }

    if (!SD.exists(filename)) {
        Serial.printf("❌ Error: Archivo %s no encontrado\n", filename);
        display.println("Error: Archivo no encontrado");
        
        // DEBUG: Listar archivos en la raíz para verificar
        Serial.println("=== ARCHIVOS EN SD ===");
        File root = SD.open("/");
        if (root) {
            File file = root.openNextFile();
            while (file) {
                Serial.printf("- %s (%d bytes)\n", file.name(), file.size());
                file = root.openNextFile();
            }
            root.close();
        }
        Serial.println("=== FIN LISTA ===");
        
        return false;
    }

    
    // Verificar si el archivo existe
    if (!SD.exists(filename)) {
        display.println("Error: Archivo no encontrado\n");
        return false;
    }

    // Reproducir archivo
    audio->connecttoFS(SD, filename); // Pass SD by reference, not pointer
    isPlaying = true;
    currentFile = String(filename);
    Serial.printf("Reproduciendo: %s\n", filename);

    return true;
}


void AudioPlayer::stop() {
    if (audio) {
        audio->stopSong();
        isPlaying = false;
        currentFile = "";
        Serial.println("Audio detenido");
    }
}

void AudioPlayer::pause() {
    if (audio && isPlaying) {
        audio->pauseResume();
        isPlaying = false;
        Serial.println("Audio pausado");
    }
}

void AudioPlayer::resume() {
    if (audio && !isPlaying && currentFile != "") {
        audio->pauseResume();
        isPlaying = true;
        Serial.println("Audio reanudado");
    }
}

void AudioPlayer::togglePlayPause() {
    if (isPlaying) {
        pause();
    } else {
        resume();
    }
}

void AudioPlayer::setVolume(int volume) {
    if (volume < 0) volume = 0;
    if (volume > 21) volume = 21;
    
    currentVolume = volume;
    if (audio) {
        audio->setVolume(currentVolume);
        Serial.printf("Volumen: %d\n", currentVolume);
    }
}

void AudioPlayer::volumeUp() {
    setVolume(currentVolume + 1);
}

void AudioPlayer::volumeDown() {
    setVolume(currentVolume - 1);
}

int AudioPlayer::getVolume() {
    return currentVolume;
}

bool AudioPlayer::isCurrentlyPlaying() {
    return isPlaying && audio && audio->isRunning();
}

String AudioPlayer::getCurrentFile() {
    return currentFile;
}

void AudioPlayer::update() {
    if (audio) {
        audio->loop();
        
        // Verificar si terminó de reproducir
        if (isPlaying && !audio->isRunning()) {
            isPlaying = false;
            Serial.println("Reproducción terminada");
        }
    }
}
