#include <M5GFX.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include "PromptSender.h"

// Configuración de red - cambiá estos valores
const char* PromptSender::ssid = WIFI_SSID;
const char* PromptSender::password = WIFI_PASSWORD;
const char* PromptSender::serverUrl = "http://192.168.1.23:5000/query";

extern M5GFX display;

PromptSender::PromptSender() {
    wifiConnected = false;
}


bool PromptSender::initWiFi() {
    display.println("Iniciando M5Core2...");
    
    WiFi.begin(ssid, password);
    
    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 20) {
        delay(500);
        display.print(".");
        attempts++;
    }
    
    if (WiFi.status() == WL_CONNECTED) {
        display.println("\nWiFi OK!");
        display.print("IP: ");
        display.println(WiFi.localIP());
        wifiConnected = true;
        return true;
    } else {
        display.println("\nError WiFi!");
        wifiConnected = false;
        return false;
    }
}

bool PromptSender::sendPrompt(const String& prompt) {
    if (!wifiConnected) {
        display.println("WiFi no conectado");
        return false;
    }
    
    if (WiFi.status() != WL_CONNECTED) {
        display.println("WiFi desconectado");
        wifiConnected = false;
        return false;
    }
    
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    http.setTimeout(10000); // 10 segundos timeout
    
    // Construir JSON payload
    String jsonPayload = "{\"prompt\": \"" + prompt + "\"}";
    
    display.println("Enviando...");
    int httpResponseCode = http.POST(jsonPayload);
    
    if (httpResponseCode > 0) {
        String response = http.getString();
        display.println("Respuesta:");
        display.println("Código: " + String(httpResponseCode));
        display.println(response);
        http.end();
        return true;
    } else {
        display.println("Error HTTP: " + String(httpResponseCode));
        http.end();
        return false;
    }
}

bool PromptSender::isWiFiConnected() {
    return wifiConnected && (WiFi.status() == WL_CONNECTED);
}