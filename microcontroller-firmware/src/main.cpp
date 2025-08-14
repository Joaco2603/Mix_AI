#include <M5GFX.h>
#include <Arduino.h>
#include <SD.h>

#include "AudioPlayer.h"
#include "MyWebServer.h"
#include "AudioMixer.h"
#include "AudioPlayer.h"

MyWebServer myWebServer;

WavReader reader;
AudioMixer mixer;

int16_t mixedBuffer[512];

AudioPlayer audioPlayer;

M5GFX display;

void setup()
{
  Serial.begin(115200);
  display.begin();
  SD.begin(4);

  myWebServer.start(&mixer);
  audioPlayer.setMixer(&mixer);

  // Limpiar pantalla y configurar
  display.clear();
  display.setTextSize(2);
  display.println("Iniciando M5Core2...");

  audioPlayer.begin();
  audioPlayer.playMixedFiles("/guitar_output.wav", "/vocal_output.wav", "/bass_output.wav");

  // Conectar WiFi
  // Mostrar controles
  display.clear();
  display.println("Canales:");
  display.println("A: Guitarra");
  display.println("B: Piano");
  display.println("C: Bajo");
}

void loop()
{
  audioPlayer.update();
}