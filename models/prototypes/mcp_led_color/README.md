# Control de LED RGB basado en temperatura y comandos seriales con ESP32

Este proyecto permite controlar un LED RGB conectado a un ESP32 a través de comandos recibidos por el puerto serial y tomando como referencia una temperatura. Además, integra la conexión WiFi para enviar información a una API de chat y recibir respuestas que determinan el color del LED.

## Características

- **Conexión WiFi:** El ESP32 se conecta a una red WiFi para enviar datos a una API mediante HTTP.
- **Control de LED RGB:** Cambia el color del LED según la temperatura recibida o comandos específicos.
- **Integración con API:** Envía la temperatura y el estado de conexión a una API y recibe el color recomendado para el LED.
- **Comandos vía Serial:** Permite controlar el LED y el flujo del programa desde el monitor serial.

## Librerías necesarias

- [Adafruit NeoPixel](https://github.com/adafruit/Adafruit_NeoPixel)
- [ArduinoJson](https://arduinojson.org/)
- WiFi.h y HTTPClient.h (incluidas en el core de ESP32 para Arduino)

## Estructura de archivos

- `main.cpp` (fragmento mostrado en la consulta): Lógica principal de conexión, obtención de comandos y control del LED.
- `model.h`: Define la estructura para almacenar la temperatura.
- `context.h`: Define la estructura para el estado de la conexión WiFi.
- `protocol.h`: Funciones para construir el prompt y enviar la temperatura a la API.

## Uso y flujo de trabajo

1. **Conexión WiFi:**  
   El ESP32 intenta conectarse a la red especificada por `ssid` y `password`.
2. **Inicialización:**  
   Al iniciar, se configura el LED y se muestra el estado en el monitor serial.
3. **Recepción de Comandos:**  
   Desde el monitor serial se pueden enviar comandos como valores de temperatura (ejemplo: `23.5`) o palabras clave como `rojo`, `verde`, `azul`, etc.
4. **Envío a API:**  
   Cuando se recibe un nuevo comando de temperatura, se envía a una API (por defecto en `http://192.168.1.69:11434/api/chat`) junto con el estado de la WiFi.
5. **Respuesta y acción:**  
   La API responde con un nombre de color en minúsculas. El ESP32 interpreta este color y enciende el LED RGB correspondiente.
6. **Comandos especiales:**  
   - `stop`: Apaga el LED y detiene el programa.
   - Comandos de color (`rojo`, `verde`, etc.): Cambian el color del LED manualmente.

## Esquema de colores según temperatura

- **rojo:** Temperatura muy alta (> 30°C)
- **amarillo:** Entre 25°C y 30°C
- **verde:** Normal (20°C – 25°C)
- **celeste:** Algo fresca (15°C – 20°C)
- **azul:** Frío (< 15°C)
- **lila:** Sin conexión WiFi
- **blanco:** Estado neutro

## Ejemplo de uso

1. Abre el monitor serial a 115200 baudios.
2. Ingresa un valor de temperatura (ejemplo: `27.5`), el ESP32 enviará este valor a la API y encenderá el LED con el color recomendado.
3. Ingresa un comando de color (`rojo`, `verde`, ...) para cambiar el color manualmente.
4. Ingresa `stop` para apagar el LED y detener el programa.

## Notas

- Modifica el `ssid` y `password` en el código para tu red WiFi.
- Cambia la URL de la API en `protocol.h` si es necesario.
- Asegúrate de tener la API funcionando y accesible desde la red local.

```