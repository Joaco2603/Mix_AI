/*
  context.h

  Estructura simple que mantiene el estado del entorno en tiempo de ejecución.
  Actualmente contiene información sobre la conexión WiFi, pero puede extenderse
  para incluir otros flags (ej: estado de sensores, última lectura, etc.).
*/

#ifndef CONTEXT_H
#define CONTEXT_H

struct Context {
  // true si el dispositivo está conectado a la red WiFi
  bool wifiConnected;
};

#endif
