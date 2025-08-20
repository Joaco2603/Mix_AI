/*
  model.h

  Definición simple del modelo de datos usado por los prototipos.
  Actualmente únicamente contiene la temperatura. Se puede ampliar para
  incluir más parámetros (humedad, timestamp, etc.).
*/

#ifndef MODEL_H
#define MODEL_H

struct Model {
  // Temperatura en grados Celsius
  float temperatura;
};

#endif
