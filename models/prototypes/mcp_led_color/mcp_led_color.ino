#include "model.h"
#include "context.h"
#include "protocol.h"
#include <Adafruit_NeoPixel.h>

#define LED_PIN    2
#define NUM_LEDS   1
Adafruit_NeoPixel strip(NUM_LEDS, LED_PIN, NEO_GRB + NEO_KHZ800);

const char* ssid = "SSID";
const char* password = "PASSWORD";

Model model;
Context context;

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi conectado.");

  strip.begin();
  strip.show();
}

String lastComando = "";

void loop() {
  if (Serial.available() > 0) {
    comando = Serial.readStringUntil('\n');
    comando.trim();
    comando.toLowerCase();

    if (comando != lastComando) {
      model.temperatura = comando.toDouble();;
      Serial.println(comando);
      lastComando = comando;
      checkAndSend(model, context);
    }
  }

  context.wifiConnected = (WiFi.status() == WL_CONNECTED);

  if (comando.indexOf("rojo") >= 0) {
    setColor(255, 0, 0);
  } else if (comando.indexOf("verde") >= 0) {
    setColor(0, 255, 0);
  } else if (comando.indexOf("azul") >= 0) {
    setColor(0, 0, 255);
  } else if (comando.indexOf("amarillo") >= 0) {
    setColor(255, 255, 0);
  } else if (comando.indexOf("celeste") >= 0) {
    setColor(0, 255, 255);
  } else if (comando.indexOf("lila") >= 0) {
    setColor(255, 0, 255);
  } else if (comando.indexOf("blanco") >= 0) {
    setColor(255, 255, 255);
  } else if (comando.indexOf("stop") >= 0) {
    apagarLed();
    Serial.println("Deteniendo programa...");
    while (true);
  } else {
    Serial.println("⚠️ Comando no reconocido.");
  }

  delay(100); 
}

void setColor(uint8_t r, uint8_t g, uint8_t b) {
  strip.setPixelColor(0, strip.Color(r, g, b));
  strip.show();
}

void apagarLed() {
  strip.setPixelColor(0, strip.Color(0, 0, 0));
  strip.show();
}