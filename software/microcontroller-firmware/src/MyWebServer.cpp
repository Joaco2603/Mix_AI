#include <M5GFX.h>

#include <WiFi.h>
#include <ESPAsyncWebServer.h>

#include "Config.h"
#include "MyWebServer.h"
#include "AudioMixer.h"
#include "AudioPlayer.h"
#include "Routes.h"

const char *ssid = WIFI_SSID;
const char *password = WIFI_PASSWORD;

extern M5GFX display;

AsyncWebServer webServer(80);

void MyWebServer::start(AudioMixer *mixer, AudioPlayer *player)
{
  // Conexión WiFi
  WiFi.begin(ssid, password);
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20)
  {
    delay(500);
    display.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED)
  {
    display.println("\nWiFi OK!");
    display.print("IP: ");
    display.println(WiFi.localIP());
  }
  else
  {
    display.println("\nError WiFi!");
  }

  delay(3000);

  // Inicializar rutas HTTP
  Routes::init(webServer, mixer, player);

  // Iniciar servidor
  webServer.begin();
}
