#ifndef PROTOCOL_H
#define PROTOCOL_H

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "model.h"
#include "context.h"

// Variable global para guardar el comando recibido
String comando = "";

String construirPrompt(const Model& model, const Context& context) {
  String prompt = "Temperatura actual: " + String(model.temperatura) + "°C.\n";
  prompt += "WiFi conectado: " + String(context.wifiConnected ? "Sí" : "No") + ".\n";

  prompt += "Selecciona un color de LED RGB según la temperatura:\n";
  prompt += "- rojo: si la temperatura es muy alta (más de 30°C)\n";
  prompt += "- amarillo: si la temperatura está entre 25°C y 30°C\n";
  prompt += "- verde: si la temperatura es normal (entre 20°C y 25°C)\n";
  prompt += "- celeste: si está algo fresca (entre 15°C y 20°C)\n";
  prompt += "- azul: si hace frío (menos de 15°C)\n";
  prompt += "- lila: si no hay conexión WiFi\n";
  prompt += "- blanco: si quieres mostrar un estado neutro\n";
  prompt += "Responde únicamente con el nombre del color en minúsculas, sin explicaciones, puntos ni texto adicional.";

  return prompt;
}


void checkAndSend(const Model &model, const Context &context) {
  Serial.println("Temperatura enviada: " + String(model.temperatura)); 
  if (!context.wifiConnected) {
    Serial.println("Sin WiFi. Saltando envío.");
    return;
  }

  HTTPClient http;
  http.begin("http://192.168.1.69:11434/api/chat");
  http.addHeader("Content-Type", "application/json");

  String prompt = construirPrompt(model, context);

  StaticJsonDocument<1024> doc;
  doc["model"] = "llama3.1";

  // Crear el array "messages"
  JsonArray messages = doc.createNestedArray("messages");

  // Mensaje system
  JsonObject systemMessage = messages.createNestedObject();
  systemMessage["role"] = "system";
  systemMessage["content"] = "Eres un asistente que solo responde con un color de LED en minúsculas, sin texto adicional.";

  // Mensaje user
  JsonObject userMessage = messages.createNestedObject();
  userMessage["role"] = "user";
  userMessage["content"] = prompt;

  doc["stream"] = false;
  doc["max_tokens"] = 3;

  String body;
  serializeJson(doc, body);

  int httpCode = http.POST(body);
  if (httpCode > 0) {
    String payload = http.getString();
    Serial.println("Respuesta completa:");
    Serial.println(payload);

    StaticJsonDocument<1024> res;
    DeserializationError error = deserializeJson(res, payload);
    if (!error) {
      comando = res["message"]["content"].as<String>();
      comando.trim();
      comando.toLowerCase();
      Serial.println("Comando extraído: " + comando);
    } else {
      Serial.println("Error al parsear la respuesta.");
    }
  } else {
    Serial.printf("Error en la solicitud HTTP: %d\n", httpCode);
  }

  http.end();
}
#endif