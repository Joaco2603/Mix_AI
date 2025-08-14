#include <M5GFX.h>

#include <WiFi.h>
#include <ESPAsyncWebServer.h>

#include "MyWebServer.h"
#include "AudioMixer.h"
#include "Routes.h"

const char *ssid = "GARAJE";
const char *password = "JEjb1307*2603*";

extern M5GFX display;

AsyncWebServer webServer(8080);

void MyWebServer::start(AudioMixer *mixer)
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
  Routes::init(webServer, mixer);

  // Iniciar servidor
  webServer.begin();
}
