# 🤖 ESP32 Gemini API Client

Este proyecto permite conectar un **ESP32** a una red WiFi y enviar peticiones POST a la API de Google Gemini (modelo generativo de lenguaje), leyendo texto desde el puerto serial y mostrando la respuesta generada en el monitor serial.

---

## 🚀 ¿Qué hace este proyecto?

- Se conecta automáticamente a una red WiFi configurada.
- Espera a que escribas texto en el monitor serial.
- Envía el texto a la API de Gemini de Google usando un payload JSON.
- Recibe y muestra la respuesta generada por la IA en el monitor serial.

---

## 📋 Requisitos

- **ESP32**
- Cuenta de Google Cloud y clave API de Gemini (https://ai.google.dev/)
- Biblioteca [`WiFi.h`], [`HTTPClient.h`], [`Arduino_JSON.h`], [`WiFiClientSecure.h`] para ESP32
- **Archivo `secrets.h` con tus credenciales** (obligatorio, ver abajo)

---

## 🔒 Archivo `secrets.h`

Debes crear un archivo llamado `secrets.h` en la raíz de tu proyecto (junto al archivo `.ino`).  
**Este archivo nunca debe subirse a repositorios públicos.**

### Ejemplo de contenido para `secrets.h`:

```cpp
#define SECRET_SSID "TuSSID"
#define SECRET_PASS "TuContraseñaWiFi"
#define API_KEY "AIzaSyD-TuClaveAPI-Generativa"
```

- **SECRET_SSID:** El nombre de tu red WiFi.
- **SECRET_PASS:** La contraseña de tu red WiFi.
- **API_KEY:** Tu clave de API de Gemini obtenida desde [Google AI Studio](https://ai.google.dev/).

---

### ¿Cómo utilizar `secrets.h`?

1. **Crea el archivo:**  
   - Haz clic derecho en tu proyecto en el IDE de Arduino o PlatformIO.
   - Selecciona "Nuevo archivo" y nómbralo `secrets.h`.

2. **Pega el contenido de ejemplo** y reemplaza los valores por los tuyos.

3. **Verifica que NO esté en tu repositorio público**. Puedes agregarlo a tu `.gitignore`:

   ```
   secrets.h
   ```

4. **El código principal incluye automáticamente este archivo:**
   ```cpp
   #include "secrets.h"
   ```

---

## ⚡ Ejemplo de uso

1. Flashea el código al ESP32.
2. Abre el monitor serial a 115200 baudios.
3. Escribe una pregunta o frase y presiona Enter.
4. El ESP32 envía el texto a Gemini y muestra la respuesta generada.

---

## 📦 Archivos principales

- `main.ino` — Código fuente de ESP32
- `secrets.h` — Credenciales WiFi y API Key (NO subir a repositorios públicos)

---

## 🧩 Personalización

Puedes modificar el payload o la forma en que se procesa la respuesta para adaptarlo a tu aplicación (control de dispositivos, chatbots, etc).

---