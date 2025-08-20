#include <Arduino.h>
#include <SD.h>

#include "AudioPlayer.h"
#include "MyWebServer.h"
#include "AudioMixer.h"
#include "AudioPlayer.h"
#include "TouchUI.h"
#include "MyUI.h"

MyWebServer myWebServer;

WavReader reader;
AudioMixer mixer;
AudioPlayer audioPlayer;

int16_t mixedBuffer[512];

M5GFX display;
MyUI myUI(display);

void setup()
{
  Serial.begin(115200);
  SD.begin(4);
  display.begin();
  audioPlayer.begin();

  myWebServer.start(&mixer, &audioPlayer);
  audioPlayer.setMixer(&mixer);

  myUI.init(&mixer, &audioPlayer);

  const char *files[] = {"/guitar_output.wav", "/vocal_output.wav", "/bass_output.wav", "/drum_output.wav"};
  audioPlayer.playMixedFiles(files);
}

void loop()
{
  myUI.update();
  audioPlayer.update();
}