// AudioPlayer.cpp
#include <M5GFX.h>
#include "AudioPlayer.h"

#include <driver/i2s.h>

#include <algorithm>
#include <iostream>
#include <cstdint>

// #define USE_SMALL_SPEAKER

#ifdef USE_SMALL_SPEAKER
    // Configuración de pines I2S para M5Stack Core2 (parlante pequeño)
    #define I2S_BCLK 12
    #define I2S_LRC 0
    #define I2S_DOUT 2
#else
    // Configuración de pines I2S para parlante grande
    #define I2S_BCLK 27
    #define I2S_LRC 26
    #define I2S_DOUT 25
#endif

#define SAMPLE_RATE 44100
#define I2S_PORT I2S_NUM_0
#define BUFFER_SIZE 1024

extern M5GFX display;

AudioPlayer::AudioPlayer()
{
    isPlaying = false;
    currentVolume = 11;
    currentFile = "";
}

bool AudioPlayer::begin()
{
#ifdef USE_SMALL_SPEAKER
    // Configuración I2S para parlante pequeño (M5Stack Core2)
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

    // Pines M5Stack Core2 (parlante pequeño)
    i2s_pin_config_t pin_config = {
        .mck_io_num = I2S_PIN_NO_CHANGE,
        .bck_io_num = 12,
        .ws_io_num = 0,
        .data_out_num = 2,
        .data_in_num = I2S_PIN_NO_CHANGE};
#else
    // Configuración I2S para parlante grande
    i2s_config_t i2s_config = {
        .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_TX),
        .sample_rate = 44100, // mismo que tu archivo
        .bits_per_sample = I2S_BITS_PER_SAMPLE_16BIT,
        .channel_format = I2S_CHANNEL_FMT_RIGHT_LEFT, // stereo
        .communication_format = I2S_COMM_FORMAT_STAND_I2S,
        .intr_alloc_flags = ESP_INTR_FLAG_LEVEL1,
        .dma_buf_count = 8,
        .dma_buf_len = 256,
        .use_apll = true,
        .tx_desc_auto_clear = true,
        .fixed_mclk = 0};

    // Configuración de pines I2S para parlante grande
    i2s_pin_config_t pin_config = {
        .bck_io_num = I2S_BCLK,
        .ws_io_num = I2S_LRC,
        .data_out_num = I2S_DOUT,
        .data_in_num = I2S_PIN_NO_CHANGE};
#endif

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

void AudioPlayer::setMixer(AudioMixer *m)
{
    mixer = m;
}

int AudioPlayer::setMasterVolume(float volume)
{
    volume = std::clamp(volume, 0.0f, 100.0f);
    currentVolume = static_cast<int>(std::round((volume / 100.0f) * 21.0f));
    return currentVolume;
}

bool AudioPlayer::pause(bool p)
{
    isPlaying = p;
    return isPlaying;
}

bool AudioPlayer::mute(bool enableMute)
{
    isMuted = enableMute;
    return isMuted;
}

bool AudioPlayer::getIsMuted()
{
    return isMuted;
}

int AudioPlayer::getVolume()
{
    return currentVolume;
}

bool AudioPlayer::isCurrentlyPlaying()
{
    return isPlaying;
}

void AudioPlayer::update()
{
    if (!isPlaying)
    {
        isPlaying = false;
        return;
    }

    int16_t buffer[512];
    size_t n = mixer->mix(buffer, 512);

    
    if (mixer->isActive())
    {
        writeToI2S(buffer, n, (!isMuted ? getVolume() : 0));
    }
    else
    {
        display.println("Fin de reproduccion");
        isPlaying = false;
    }
}

void AudioPlayer::writeToI2S(int16_t *buffer, size_t samples, int volume)
{
    int16_t stereoBuffer[1024];
    for (size_t i = 0; i < samples; ++i)
    {
        int32_t sample = static_cast<int32_t>(buffer[i]) * volume; // aplicar volumen
        sample = std::clamp(sample, (int32_t)-32768, (int32_t)32767);

        stereoBuffer[2 * i] = static_cast<int16_t>(sample);     // Left
        stereoBuffer[2 * i + 1] = static_cast<int16_t>(sample); // Right
    }

    size_t bytes_written;
    esp_err_t err = i2s_write(I2S_NUM_0, stereoBuffer, samples * 2 * sizeof(int16_t), &bytes_written, portMAX_DELAY);
}
