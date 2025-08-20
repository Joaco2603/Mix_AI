/*
  connect_api_llm.ino

  Ejemplo de ESP32 que envía texto leido por Serial a la API de Google Gemini
  (Generative Language API) y muestra la respuesta en el monitor serial.

  Buenas prácticas aplicadas:
  - Uso de un archivo `secrets.h` (no versionado) para credenciales.
  - Escape manual de strings para JSON para evitar payloads inválidos.
  - Reintento simple y tiempo de espera para evitar bloqueos.

  Requisitos:
  - Archivo `secrets.h` con SECRET_SSID, SECRET_PASS y API_KEY.
  - Librerías: WiFi, HTTPClient, Arduino_JSON, WiFiClientSecure.

  Notas de seguridad:
  - No subir `secrets.h` a repositorios públicos.
  - Preferir tokens con permisos mínimos y rotarlos si es posible.
*/

#include <WiFi.h>
#include <HTTPClient.h>
#include <Arduino_JSON.h>
#include <WiFiClientSecure.h>

// secrets.h debe definirse localmente. Ver "secrets.h.example" en esta carpeta.
#include "secrets.h"

// Variables de conexión (tomadas desde secrets.h)
const char* ssid = SECRET_SSID;
const char* password =  SECRET_PASS;

// Escapa caracteres que rompen JSON en el texto recibido por Serial
String escapeJSONString(String s) {
  s.replace("\\", "\\\\");
  s.replace("\"", "\\\"");
  s.replace("/", "\\/");
  s.replace("\b", "\\b");
  s.replace("\f", "\\f");
  s.replace("\n", "\\n");
  s.replace("\r", "\\r");
  s.replace("\t", "\\t");
  return s;
}

HTTPClient http;

void setup() {
  // Inicialización serial e intentos de conexión WiFi
  Serial.begin(115200);
  delay(4000);   // Delay necesario antes de llamar a WiFi.begin en algunos entornos

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi..");
  }

  Serial.println("Connected to the WiFi network");
}

void loop() {
  // Esperar entrada del usuario por Serial
  while(Serial.available() == 0){}

  String input = Serial.readString();
  input.trim();
  input = escapeJSONString(input);

  // Construir el JSON para la API de Gemini
  String payload = "{";
  payload += "\"contents\": [ { \"parts\": [ { \"text\": \"" + input + "\" } ] } ]";
  payload += "}";

  Serial.println("Enviando payload: " + payload);

  if(WiFi.status()== WL_CONNECTED){
    // Construir URL usando la API_KEY desde secrets.h
    String url = String("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=") + API_KEY;
    http.begin(url);

    http.setTimeout(15000);  // Esperar hasta 15s si el servidor es lento
    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.POST(payload);

    if(httpResponseCode>0){
      JSONVar responseObj = JSON.parse(http.getString());
      // Extraer el texto desde la estructura de la respuesta (puede variar según la versión de la API)
      String text = (const char*)responseObj["candidates"][0]["content"]["parts"][0]["text"];
      Serial.println("Respuesta: " + text);
    } else {
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  } else {
    Serial.println("Error in WiFi connection");
  }

  // Pausa entre peticiones para evitar rate limits accidentales
  delay(10000);
}