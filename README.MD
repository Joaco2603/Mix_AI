<p align="center">
  <img src="./assets/image.png" width="200" alt="Mix AI Logo" />
</p>

<h1 align="center">🚀 MIX AI</h1>

<p align="center">
  Mixer de audio inteligente para conciertos y grabaciones, con integración de LLM para personalización sonora en tiempo real.
</p>

<p align="center">
  <a href="https://paypal.me/kamilmysliwiec" target="_blank">
    <img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="PayPal"/>
  </a>
  <a href="#" target="_blank">
    <img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="OpenCollective"/>
  </a>
</p>

---

## 1. 📄 Resumen del Proyecto

Mix AI es un sistema de mezcla de audio en tiempo real basado en ESP32, diseñado para conciertos, estudios o prácticas personales. Utiliza un modelo de lenguaje (LLM) para adaptar el audio de forma automática según preferencias del usuario o el tipo de audio detectado.

---

## 2. 🧪 Cómo correrlo

### Clona el proyecto

```bash
git clone https://github.com/Joaco2603/MixAi_microcontroler.git
```

### Pasos para correrlo 


#### 1. Conecta el ESP32 a tu computadora por USB.

#### 2. Abre el proyecto en Arduino IDE o PlatformIO.

#### 3. Configura las credenciales en Config.h (ver sección Configuración).

#### 4. Selecciona la placa y puerto correcto.

#### 5. Compila el código.

#### 6. Usa el Monitor Serial para verificar.



## 3. ✨ Características
- #### 🎛️ Control automático del audio usando IA.

- #### 📶 Conectividad Wi-Fi.

- #### 🔊 Entrada de micrófono integrada.

- #### 📤 Envío de audio al backend vía WebSockets.

- #### 📥 Recepción de comandos/audio desde backend o smartphone.

- #### 🎨 Interfaz de configuración mediante comandos.


## 4. 🧠 Arquitectura del Sistema

### Entrada de audio

```bash
[Micrófono] -> [ESP32 M5 V1.11] -> [Procesado de audio]
```

### Salida de audio

```bash
[Micrófono] -> [ESP32 M5 V1.11] -> [Modulo I2S] -> [Salida en parlante]
```

### Model Context Protocol

```bash
[Micrófono o Texto desde el telefono] -> [ESP32] -> [MCP] -> [API Reactiva] -> [Modificación del audio en el ESP32 M5]
```


## 5. 📈 Diagramas Eléctricos


## 6. ⚙️ Hardware Utilizado

 #### Esp32 de cr Cibernetica
 #### Esp32 M5 Stack V1.11 incluye:
- #### Micrófono SPM1423
- #### Amplificador de audio I2S (NS4168)
- #### Altavoz
- #### Pantalla tactil
- #### Cables jumper
#### PCM5102a externo
#### PCM5012 externo

## 7. 💻 Software y Librerías

## IDE Recomendado
- #### PlatformIO (VS Code)
- #### Arduino IDE 1.8.x+


## Librerías necesarias
- #### WiFi

- #### HTTPClient

- #### ArduinoJson

## 8. 🤖 Modelo de IA Usado

#### El sistema se comunica con un MCP que usa un modelo tipo LLM (Large Language Model) que analiza comandos de audio o texto y devuelve ajustes recomendados. Se puede usar OpenAI, Llama, u otro modelo compatible vía API.

## 9. 📌 Casos de Uso

#### Mezcla en vivo asistida por IA
#### Grabación autónoma con ajustes automáticos
#### Control de audio para transmisiones en vivo
#### Modo práctica con recomendaciones por voz

## 10. 🛠️ Instalación y Montaje

#### 1. Montar el ESP32 en caja o estructura según necesidad.

#### 2. Conectar micrófono interno o externo.

#### 3. (Opcional) Conectar potenciómetros a pines analógicos.

#### 4. (Opcional) Conectar módulo PCM5102 a I2S.

#### 5. Alimentar por USB o batería.

## 11. 🐛 Problemas Conocidos y Soluciones

- #### No hay sonido: Verificar I2S o volumen.

- #### Wi-Fi no conecta: Revisa credenciales en Config.h.

- #### Parlante suena muy bajo: Usa módulo amplificador externo.

## 12. 🔮 Futuras Mejoras

- #### Modo Bluetooth Audio in/out.

- #### Integración con asistentes de voz.

- #### Integración del procesamiento de efectos en el ESP32.

## 13. 📜 Licencia y Créditos

Este proyecto es Open Source bajo licencia MIT.

## Autores

- [Joaquin Pappa](https://github.com/Joaco2603)
- [Andres Calvo](https://github.com/AndresACV)
- [Jeffry Valverde](https://github.com/JeffryVF)
- [Dylan Josue](https://github.com/Djch18)

## 14. 📎 Anexos
- Logs de pruebas

- Referencias a datasheets

- Links de componentes usados

