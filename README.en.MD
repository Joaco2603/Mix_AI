<p align="center">
<img src="./assets/image.png" width="200" alt="AI Mix Logo" />
</p>

<h1 align="center">🚀 AI MIX</h1>

<p align="center">
Smart audio mixer for gigs and recordings, with LLM integration for real-time sound customization.
</p>

<p align="center">
<a href="https://paypal.me/kamilmysliwiec" target="_blank">
<img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="PayPal"/>
</a>
<a href="#" target="_blank">
<img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="OpenCollective"/>
</a>
<a href="#" target="_blank">
<img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow Twitter"/>
</a>
</p>

---

## 1. 📄 Project Overview

Mix AI is an ESP32-based real-time audio mixing system designed for gigs, studios, or personal practice. It uses a language model (LLM) to automatically adapt audio based on user preferences or the type of audio detected.

---

## 2. 🧪 How to Run It

### Clone the Project

```bash
git clone https://github.com/Joaco2603/MixAi_microcontroler.git
```

### Steps to Run It

#### 1. Connect the ESP32 to your computer via USB.

#### 2. Open the project in Arduino IDE or PlatformIO.

#### 3. Configure the credentials in Config.h (see Configuration section).

#### 4. Select the correct board and port.

#### 5. Compile the code.

#### 6. Use Serial Monitor to verify.

## 3. ✨ Features
- #### 🎛️ Automatic audio control using AI.

- #### 📶 Wi-Fi connectivity.

- #### 🔊 Integrated microphone input.

- #### 📤 Send audio to the backend via WebSockets.

- #### 📥 Receive commands/audio from the backend or smartphone.

- #### 🎨 Command-based configuration interface.

## 4. 🧠 System Architecture

### Audio input

``` bash
[Microphone] -> [ESP32 M5 V1.11] -> [Audio Processing]
```

### Audio output

```bash
[Microphone] -> [ESP32 M5 V1.11] -> [I2S Module] -> [Speaker Output]
```

### Model Context Protocol

```bash
[Microphone or Text from Phone] -> [ESP32] -> [MCP] -> [Reactive API] -> [Update audio in ESP32 M5]
```


## 5. 📈 Wiring Diagrams

## 6. ⚙️ Hardware Used

- #### 2Esp32
- #### Built-in Microphone
- #### External PCM5102a
- #### Cable Jumper

## 7. 💻 Software and Libraries

## Recommended IDE
- #### IO Platform (VS Code)
- #### ArduinoIDE 1.8.x+

## Required Libraries
- #### Wi-Fi

- #### HTTP Client

- #### ArduinoJson

## 8. 🤖 AI Model Used

#### The system communicates with an MCP that uses a Large Language Model (LLM) that analyzes audio or text commands and returns recommended settings. OpenAI, Llama, or another compatible model can be used via API.

## 9. 📌 Use Cases

#### AI-Assisted Live Mixing
#### Autonomous Recording with Automatic Adjustments
#### Audio Control for Live Streams
#### Practice Mode with Voice Recommendations

## 10. 🛠️ Installation and Setup

#### 1. Mount the ESP32 in a case or truss as needed.

#### 2. Connect the internal or external microphone.

#### 3. (Optional) Connect potentiometers to analog pins.

#### 4. (Optional) Connect the PCM5102 module to I2S.

#### 5. Power via USB or battery.

## 11. 🐛 Known Issues and Solutions

- #### No sound: Check I2S or volume in the backend.

- #### Wi-Fi not connecting: Check credentials in Config.h.

- #### Speaker sounds very low: Use an external amplifier module.

## 12. 🔮 Future Improvements

- #### Bluetooth audio input/output mode.

- #### Voice assistant integration.

- #### Improved effects processing on the ESP32.

## 13. 📜 License and Credits

This project is open source under the MIT license.

- Authors
<br/>
[Joaquín Pappa](https://github.com/Joaco2603)
<br/>
[Andrés Calvo](https://github.com/AndresACV)
<br/>
[Jeffry Valverde](https://github.com/JeffryVF)
<br/>
[Dylan Josue](https://github.com/Djch18)



## 14. 📎 Appendices
- Test logs

- References and datasheets

- Links to components used