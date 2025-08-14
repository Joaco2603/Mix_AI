#include "Routes.h"
#include <ArduinoJson.h>
#include "AudioMixer.h"

void Routes::init(AsyncWebServer &server, AudioMixer *mixer)
{
  server.on("/status", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->send(200, "text/plain", "ok"); });
            
  // Endpoint that change volumes - CAPTURA mixer en la lambda
  server.on("/volume", HTTP_POST, [mixer](AsyncWebServerRequest *request)  // <-- Aquí está el cambio
            {
    if (!request->hasParam("channel", true) || !request->hasParam("value", true)) {
      request->send(400, "application/json", "{\"error\":\"Missing channel or value\"}");
      return;
    }
    
    int channel = request->getParam("channel", true)->value().toInt();
    float value = request->getParam("value", true)->value().toFloat();
    
    if (channel < 0 || channel >= 4) {
      request->send(400, "application/json", "{\"error\":\"Invalid channel\"}");
      return;
    }
    
    if (!mixer) {
      request->send(500, "application/json", "{\"error\":\"Mixer not initialized\"}");
      return;
    }
    
    // clamp entre 0 y 100
    if (value < 0.0f) value = 0.0f;
    if (value > 100.0f) value = 100.0f;
    
    Serial.printf("Route: mixer=%p set channel=%d to=%f\n", (void*)mixer, channel, value);
    mixer->setChannelVolume(channel, value / 100.0f);
    request->send(200, "application/json", "{\"status\":\"volume set\"}"); 
  });
}