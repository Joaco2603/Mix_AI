<<<<<<< HEAD
=======
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

>>>>>>> 122384a318a4f112711a971912eab3eae974404e
#include <WiFi.h>
#include <HTTPClient.h>
#include <Arduino_JSON.h>
#include <WiFiClientSecure.h>
<<<<<<< HEAD
#include "secrets.h"
const char* ssid = SECRET_SSID;
const char* password =  SECRET_PASS;
 
=======

// secrets.h debe definirse localmente. Ver "secrets.h.example" en esta carpeta.
#include "secrets.h"

// Variables de conexión (tomadas desde secrets.h)
const char* ssid = SECRET_SSID;
const char* password =  SECRET_PASS;

// Escapa caracteres que rompen JSON en el texto recibido por Serial
>>>>>>> 122384a318a4f112711a971912eab3eae974404e
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
<<<<<<< HEAD
 
  Serial.begin(115200);
  delay(4000);   // Delay needed before calling the WiFi.begin
 
  WiFi.begin(ssid, password); 
 
  while (WiFi.status() != WL_CONNECTED) { // Check for the connection
    delay(1000);
    Serial.println("Connecting to WiFi..");
  }
 
=======
  // Inicialización serial e intentos de conexión WiFi
  Serial.begin(115200);
  delay(4000);   // Delay necesario antes de llamar a WiFi.begin en algunos entornos

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi..");
  }

>>>>>>> 122384a318a4f112711a971912eab3eae974404e
  Serial.println("Connected to the WiFi network");
}

void loop() {
<<<<<<< HEAD
=======
  // Esperar entrada del usuario por Serial
>>>>>>> 122384a318a4f112711a971912eab3eae974404e
  while(Serial.available() == 0){}

  String input = Serial.readString();
  input.trim();
  input = escapeJSONString(input);

<<<<<<< HEAD
  // Construir el JSON manualmente
=======
  // Construir el JSON para la API de Gemini
>>>>>>> 122384a318a4f112711a971912eab3eae974404e
  String payload = "{";
  payload += "\"contents\": [ { \"parts\": [ { \"text\": \"" + input + "\" } ] } ]";
  payload += "}";

  Serial.println("Enviando payload: " + payload);

<<<<<<< HEAD
  if(WiFi.status()== WL_CONNECTED){   // Check WiFi connection status   
  
   String url = String("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=") + API_KEY;
   http.begin(url);

   http.setTimeout(15000);  // Wait up to 15 sec if the server is slow
   http.addHeader("Content-Type", "application/json"); // Specify content-type header
   int httpResponseCode = http.POST(payload); // Send the actual POST request
  
   if(httpResponseCode>0){
    JSONVar responseObj = JSON.parse(http.getString());
    String text = (const char*)responseObj["candidates"][0]["content"]["parts"][0]["text"];
    Serial.println("Respuesta: " + text);      
   } else {
  
    Serial.print("Error on sending POST: ");
    Serial.println(httpResponseCode);
   }
   http.end();
  }else{
    Serial.println("Error in WiFi connection");   
  }
  
  delay(10000);  // Send a request every 10 seconds
=======
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
>>>>>>> 122384a318a4f112711a971912eab3eae974404e
}