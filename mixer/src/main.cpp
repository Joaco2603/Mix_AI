#include <M5GFX.h>
#include "PromptSender.h"
#include "AudioPlayer.h"

PromptSender *sender = nullptr;
AudioPlayer audioPlayer;
M5GFX display;

void setup()
{
  Serial.begin(115200); // ¡FALTABA!
  display.begin();

  // Limpiar pantalla y configurar
  display.clear();
  display.setTextSize(2);
  display.println("Iniciando M5Core2...");

  audioPlayer.begin();

  // Inicializar AudioPlayer
  if (!audioPlayer.begin())
  { // ¡FALTABA!
    display.println("Error: AudioPlayer");
    return;
  }

  // Ahora sí reproducir
  audioPlayer.playFile("/MUSIC.MP3");
  delay(10000);

  // Crear objetos después de inicializar M5
  sender = new PromptSender();

  // Conectar WiFi
  delay(1000);
  display.clear();
  if (sender->initWiFi())
  {
    delay(1000);

    // Enviar prompt inicial
    display.clear();
    sender->sendPrompt("Sistema iniciado");
  }

  // Mostrar controles
  display.clear();
  display.println("Controles:");
  display.println("A: Subir volumen");
  display.println("B: Bajar volumen");
  display.println("C: Play/Pause");
}

void loop()
{
  audioPlayer.update();

  // ¡FALTABA! Leer botones (si usas M5Stack)
  // M5.update();
  // if (M5.BtnA.wasPressed()) audioPlayer.volumeUp();
  // if (M5.BtnB.wasPressed()) audioPlayer.volumeDown();
  // if (M5.BtnC.wasPressed()) audioPlayer.togglePlayPause();
}