/*
  mcp_led_color.ino

  Control simple de un LED NeoPixel (1 LED) usando comandos por Serial
  y una API remota que sugiere el color según la temperatura.

  Diseño y buenas prácticas aplicadas:
  - Separación de responsabilidades: `model.h`, `context.h` y `protocol.h` contienen
    estructuras y lógica de comunicación; este archivo contiene la lógica de I/O y control.
  - Lectura de comandos via Serial con terminador '\n'.
  - Debounce lógico: se ignoran comandos repetidos (variable `lastComando`).
  - Uso del patrón de configuración a través de `secrets.h` recomendado (no versionado).

  Entradas:
  - Comandos enviados por Serial (ej: "27.5\n" o "rojo\n").

  Comportamiento:
  - Si el comando es numérico se interpreta como temperatura y se envía a la API.
  - Si el comando contiene palabras clave de color se ajusta el LED localmente.

  Notas:
  - Asegúrate de definir `SECRET_SSID` y `SECRET_PASS` en un `secrets.h` local.
  - Evitar hardcodear IPs: `protocol.h` permite configurar la URL via macro.
*/

#include "model.h"
#include "context.h"
#include "protocol.h"
#include <Adafruit_NeoPixel.h>

// Pines y configuración del LED
#define LED_PIN    2
#define NUM_LEDS   1
Adafruit_NeoPixel strip(NUM_LEDS, LED_PIN, NEO_GRB + NEO_KHZ800);

// Valores por defecto (reemplazar con secrets.h si se configura)
const char* ssid = "SSID";
const char* password = "PASSWORD";

Model model;
Context context;

// Inicialización del hardware y conexión WiFi
void setup() {
  Serial.begin(115200);
  // Intento básico de conexión WiFi
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi conectado.");

  strip.begin();
  strip.show();
}

// Guardamos el último comando para evitar procesarlo dos veces
String lastComando = "";

// Bucle principal: lectura de Serial, actualización de contexto y control del LED
void loop() {
  if (Serial.available() > 0) {
    // Leer hasta el terminador '\n'
    comando = Serial.readStringUntil('\n');
    comando.trim();
    comando.toLowerCase();

    // Si es un nuevo comando de temperatura, enviar a la API
    if (comando != lastComando) {
      model.temperatura = comando.toDouble();
      Serial.println(comando);
      lastComando = comando;
      checkAndSend(model, context); // Definida en protocol.h
    }
  }

  // Actualizar estado de conexión WiFi
  context.wifiConnected = (WiFi.status() == WL_CONNECTED);

  // Interpretación local de comandos de color (sencillo y determinista)
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
    // Detener ejecución (uso de while(true) intencional para demos)
    while (true);
  } else {
    Serial.println("\u26a0\ufe0f Comando no reconocido.");
  }

  delay(100);
}

// Funciones auxiliares para controlar el NeoPixel
void setColor(uint8_t r, uint8_t g, uint8_t b) {
  strip.setPixelColor(0, strip.Color(r, g, b));
  strip.show();
}

void apagarLed() {
  strip.setPixelColor(0, strip.Color(0, 0, 0));
  strip.show();
}