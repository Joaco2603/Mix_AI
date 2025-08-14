// AudioPlayer.cpp
#include <M5GFX.h>
#include "AudioPlayer.h"

#include <driver/i2s.h>

// Configuración de pines I2S para M5Stack
#define I2S_BCLK 12
#define I2S_LRC 0
#define I2S_DOUT 2

#define SAMPLE_RATE 44100
#define I2S_PORT I2S_NUM_0
#define BUFFER_SIZE 1024

extern M5GFX display;

AudioPlayer::AudioPlayer()
{
    isPlaying = false;
    currentVolume = 15;
    currentFile = "";
}

bool AudioPlayer::begin()
{
   // Configuración I2S
    i2s_config_t i2s_config = {
        .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_TX),
        .sample_rate = SAMPLE_RATE,
        .bits_per_sample = I2S_BITS_PER_SAMPLE_16BIT,
        .channel_format = I2S_CHANNEL_FMT_RIGHT_LEFT,
        .communication_format = I2S_COMM_FORMAT_STAND_I2S,
        .intr_alloc_flags = ESP_INTR_FLAG_LEVEL1,
        .dma_buf_count = 8,
        .dma_buf_len = 512,
        .use_apll = false,
        .tx_desc_auto_clear = true};

    // Pines M5Stack Core2
    i2s_pin_config_t pin_config = {
        .mck_io_num = I2S_PIN_NO_CHANGE,
        .bck_io_num = 12,
        .ws_io_num = 0,
        .data_out_num = 2,
        .data_in_num = I2S_PIN_NO_CHANGE};

 // Instalar y configurar I2S
    esp_err_t err = i2s_driver_install(I2S_PORT, &i2s_config, 0, NULL);
    if (err != ESP_OK)
    {
        Serial.printf("ERROR: i2s_driver_install failed: %d\n", err);
        return false;
    }

    err = i2s_set_pin(I2S_PORT, &pin_config);
    if (err != ESP_OK)
    {
        Serial.printf("ERROR: i2s_set_pin failed: %d\n", err);
        return false;
    }

    // Limpiar buffers DMA
    i2s_zero_dma_buffer(I2S_PORT);

    Serial.println("AudioPlayer inicializado correctamente");
    return true;
}

bool AudioPlayer::playMixedFiles(const char *f1, const char *f2, const char *f3)
{
    if (!mixer)
    {
        Serial.println("[Error] mixer no inicializado");
        return false;
    }

    mixer->begin();
    mixer->addTrack(f1, 1.0f);
    mixer->addTrack(f2, 1.0f);
    mixer->addTrack(f3, 1.0f);
    isPlaying = true;
    return true;
}

void AudioPlayer::setMixer(AudioMixer *m)
{
    mixer = m;
}


void AudioPlayer::setVolume(int volume)
{
    if (volume < 0)
        volume = 0;
    if (volume > 21)
        volume = 21;

    currentVolume = volume;
    // if (audio)
    // {
    //     audio->setVolume(currentVolume);
    //     Serial.printf("Volumen: %d\n", currentVolume);
    // }
}

void AudioPlayer::volumeUp()
{
    setVolume(currentVolume + 1);
}

void AudioPlayer::volumeDown()
{
    setVolume(currentVolume - 1);
}

int AudioPlayer::getVolume()
{
    return currentVolume;
}

bool AudioPlayer::isCurrentlyPlaying()
{
    // return isPlaying && audio && audio->isRunning();
    return true;
}

String AudioPlayer::getCurrentFile()
{
    return currentFile;
}

void AudioPlayer::update()
{
    if (!isPlaying || !mixer)
    {
        isPlaying = false;
        return;
    }

    int16_t buffer[512];
    size_t n = mixer->mix(buffer, 512);

    if (n > 0)
    {
        writeToI2S(buffer, n);
    }
    else
    {
        display.println("Fin de reproduccion");
        isPlaying = false;
    }
}


void AudioPlayer::writeToI2S(int16_t *buffer, size_t samples)
{
    int16_t stereoBuffer[1024];
    for (size_t i = 0; i < samples; ++i)
    {
        stereoBuffer[2 * i] = buffer[i];     // Left channel
        stereoBuffer[2 * i + 1] = buffer[i]; // Right channel
    }

    size_t bytes_written;
    esp_err_t err = i2s_write(I2S_NUM_0, stereoBuffer, samples * 2 * sizeof(int16_t), &bytes_written, portMAX_DELAY);
    if (err != ESP_OK)
    {
        Serial.printf("Error en i2s_write: %d\n", err);
    }
}
