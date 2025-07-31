# 🎤 Control de Voz ESP32 BLE

Este proyecto permite controlar un dispositivo **ESP32** usando comandos de voz enviados por **Bluetooth Low Energy (BLE)** desde una interfaz web moderna. Usa reconocimiento de voz en el navegador y un sketch en el ESP32 para recibir y mostrar los comandos hablados.

---

## 🚀 ¿Qué hace este proyecto?

- El usuario abre la interfaz web, conecta al ESP32 por BLE y presiona "Iniciar Reconocimiento".
- Todo lo que diga al micrófono se reconoce y se envía automáticamente al ESP32.
- El ESP32 recibe, muestra y puede usar el texto para controlar otros dispositivos o acciones.

---

## 🖥️ Interfaz Web

La interfaz está creada en HTML, CSS y JavaScript puro:

- Botón para conectar/desconectar BLE.
- Botón para iniciar/detener reconocimiento de voz (Web Speech API).
- Indicador visual de estado de conexión y de grabación.
- Área de log para mensajes del sistema y texto reconocido.
- No requiere instalación de apps: solo navegador compatible con Web Bluetooth y Web Speech API (Chrome recomendado).

### Estructura principal (`index.html`)

```html
<!-- Fragmento -->
<div class="header">
    <h1>🎤 Control de Voz ESP32 BLE</h1>
    <p>Habla y envía comandos por Bluetooth Low Energy</p>
</div>
...
<button id="connectBtn" class="btn-primary">🔗 Conectar BLE</button>
<button id="startBtn" class="btn-secondary" disabled>🎤 Iniciar Reconocimiento</button>
<button id="stopBtn" class="btn-danger" disabled>⏹️ Detener</button>
...
<div id="transcript" class="transcript-area">
    El texto reconocido aparecerá aquí...
</div>
```

---

## 🛰️ Código ESP32

El ESP32 utiliza el stack BLE para crear un servidor compatible con el servicio UART de Nordic (NUS), permitiendo recibir texto desde la web.

### Características principales

- Servicio BLE UUID: `6e400001-b5a3-f393-e0a9-e50e24dcca9e`
- RX: Recibe texto (comandos de voz) desde la web.
- TX: (Opcional) Puede enviar notificaciones de vuelta.
- Conexión, desconexión y auto-reinicio de advertising.
- Imprime en Serial el texto recibido.

### Fragmento de Sketch (Arduino):

```cpp
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#define SERVICE_UUID           "6e400001-b5a3-f393-e0a9-e50e24dcca9e"
#define CHARACTERISTIC_UUID_RX "6e400002-b5a3-f393-e0a9-e50e24dcca9e"
#define CHARACTERISTIC_UUID_TX "6e400003-b5a3-f393-e0a9-e50e24dcca9e"

// ... setup BLE, callbacks y manejo de texto recibido ...

void setup() {
  Serial.begin(115200);
  BLEDevice::init("ESP32-Voice");
  // ... setup BLE ...
}
void loop() {
  // ... mantener advertising activo si desconectado ...
}
```

---

## 🛠️ ¿Cómo usarlo?

### 1. Flashear el código en tu ESP32

- Usa el IDE de Arduino o PlatformIO.
- Instala la librería `ESP32 BLE Arduino`.
- Carga el sketch proporcionado.

### 2. Abrir la interfaz web

- Sube los archivos `index.html`, `styles.css` y `scripts.js` a un servidor local (puedes usar [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) en VSCode).
- Abre la página en **Google Chrome** (desktop recomendado).

### 3. Conexión y uso

- Haz clic en **"Conectar BLE"**, selecciona tu ESP32 en la lista.
- Presiona **"Iniciar Reconocimiento"** y habla.
- El texto reconocido se enviará automáticamente al ESP32 y aparecerá en el monitor serial.

---

## 📦 Archivos principales

- `index.html` — Interfaz web
- `styles.css` — Estilos visuales
- `scripts.js` — Lógica de BLE y reconocimiento de voz
- `esp32_ble_voice.ino` — Código fuente para ESP32

---

## 📋 Requisitos

- **ESP32** (cualquier modelo con BLE)
- Navegador web moderno (**Chrome** recomendado)
- [Librería ESP32 BLE Arduino](https://github.com/nkolban/ESP32_BLE_Arduino)

---

## ✨ Ejemplo de uso

1. Usuario conecta BLE desde web.
2. Habla: "Enciende la luz".
3. El ESP32 recibe: "Enciende la luz" y lo muestra en el Serial.

---

## 🧩 Personalización

Puedes modificar la lógica en el ESP32 para ejecutar comandos según el texto recibido, por ejemplo:

```cpp
if (receivedText == "enciende la luz") {
  digitalWrite(LUZ_PIN, HIGH);
}
```

---