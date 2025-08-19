<div align="center">
<img src="./assets/image.png" width="200" alt="AI Mix Logo" />
</div>
<h1 align="center">🚀 MIX AI</h1>

---

## Estructura del Repositorio
```bash
/assets/                 # Recursos visuales y documentales (imágenes, diagramas, PDFs, etc.)
/frontend-client/        # Aplicación Web desarrollada en NextJS para el manejdo del Mixer
/microcontroller-firmware # Código del firmware de la Mixer
/volume-api/             # Proyecto backend en Spring Boot que expone una API RESTful con integración de chat
/volume-mcp/             # Implementación del Model Context Protocol (MCP) en Spring Boot
/prototypes/             # Códigos experimentales o pruebas descartables para referencia futura
README.md                # Descripción general del proyecto
```

## Información del Proyecto
- **Jeffry Valverde** – Coordinador General, responsable de AI & IoT. GitHub: [JeffryVF](https://github.com/JeffryVF)
- **Joaquín Pappa** – Coordinador de Desarrollo Back-end & IoT. GitHub: [Joaco2603](https://github.com/Joaco2603)
- **Dylan Josue** – Coordinador de Desarrollo Front-end. GitHub: [Djch18](https://github.com/Djch18)
- **Andrés Calvo** – Coordinador de Procesos y Gestión de Proyecto. GitHub: [AndresACV](https://github.com/AndresACV)

## Descripción y Justificación
- **Problema que se aborda:**  
Muchos músicos no tienen conocimientos técnicos de mezcla de sonido o configuración de sistemas de audio complejos. Esto dificulta su capacidad para presentarse en vivo o transmitir sin depender de técnicos especializados.

- **Importancia y contexto:**  
Existen mezcladoras y software complejos, pero pocos dispositivos accesibles que permitan controlar el sonido mediante lenguaje natural. El proyecto busca facilitar la vida de músicos y creadores al permitir que puedan ajustar su sonido simplemente con comandos de voz o texto.

- **Usuarios/beneficiarios:**
    -  Músicos (profesionales y amateurs)
    - Técnicos de sonido en eventos pequeños
    - Creadores de contenido musical
    - Escuelas de música y estudios caseros

## Objetivos del Proyecto
- **Objetivo General:**
Desarrollar una mezcladora de audio inteligente potenciada por un modelo de lenguaje (LLM), que permita a los usuarios modificar configuraciones de sonido usando lenguaje natural.
- **Objetivos Específicos:**  
    - Integrar un microcontrolador con sensores y módulos de audio.
    - Establecer comunicación entre el hardware y una LLM para interpretar comandos.
    - Diseñar una interfaz simple y accesible para el usuario.
    - Conectar el LLM con un MCP para facilitar la compresión del lenguaje natural.

## Requisitos Iniciales
- Lista breve de lo que el sistema debe lograr:  
  - Interpretar comandos de audio en lenguaje natural. 
  - Controlar niveles de salida y efectos de sonido en tiempo real.
  - Tener una interfaz física o digital intuitiva.


## Diseño Preliminar del Sistema
- **Arquitectura:**  
<img src="./assets/arquitectura.png" width="500" alt="Diagrama de arquitectura Mix AI" />

- **Componentes previstos:**  
  - Microcontrolador: ESP32 M5 V1.11
  - Microcontrolador: Ideaboard
  - Parlante: Rienok 
  - Cable de audio: Jack 3.5
  - Modulo: PCM5102
  - LLM/API: Local Llama3.1

## 🚀 Configuración y Ejecución

### Prerequisitos
- **JDK 21** instalado
- **Git** para clonar el repositorio
- **Google Cloud Account** con acceso a Vertex AI
- **Gemini API Key** (desde Google AI Studio o Google Cloud)

### 🔧 Configuración Inicial

#### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd Mix_AI
```

#### 2. Configurar Google Cloud Credentials

##### Opción A: Service Account (Recomendado para Producción)
1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear o seleccionar un proyecto
3. Habilitar la **Vertex AI API**
4. Crear un **Service Account** con rol "Vertex AI User"
5. Descargar el archivo JSON de credenciales

##### Opción B: Google AI Studio (Más Simple)
1. Ir a [Google AI Studio](https://aistudio.google.com/)
2. Crear un proyecto
3. Generar una API Key

#### 3. Configurar Variables de Entorno

Crear el archivo `volume-api/.env`:
```bash
GEMINI_API_KEY=tu-api-key-aqui
GOOGLE_APPLICATION_CREDENTIALS=ruta-a-tu-archivo-credenciales.json
GOOGLE_CLOUD_PROJECT_ID=tu-project-id
```

### 🐧 Configuración en Linux/WSL

#### 1. Verificar JDK 21
```bash
java -version
# Si no tienes JDK 21:
sudo apt update && sudo apt install openjdk-21-jdk -y
```

#### 2. Colocar Credenciales
```bash
# Crear directorio
mkdir -p ~/.config/gcloud/

# Copiar tu archivo service-account-key.json a:
# ~/.config/gcloud/service-account-key.json
```

#### 3. Actualizar .env
```bash
# Editar volume-api/.env
GOOGLE_APPLICATION_CREDENTIALS=/home/tu-usuario/.config/gcloud/service-account-key.json
```

#### 4. Ejecutar el Sistema
```bash
# Terminal 1 - MCP Server (puerto 8081)
cd volume-mcp
./mvnw spring-boot:run

# Terminal 2 - API Server (puerto 8080)
cd volume-api
export GOOGLE_APPLICATION_CREDENTIALS="$HOME/.config/gcloud/service-account-key.json"
export GOOGLE_CLOUD_PROJECT_ID="tu-project-id"
export GEMINI_API_KEY="tu-api-key"
./mvnw spring-boot:run
```

### 🪟 Configuración en Windows

#### 1. Verificar JDK 21
```powershell
java -version
# Si no tienes JDK 21, descargar desde:
# https://adoptium.net/temurin/releases/?version=21
```

#### 2. Colocar Credenciales
```powershell
# Crear directorio (PowerShell)
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.config\gcloud"

# Copiar tu archivo service-account-key.json a:
# C:\Users\tu-usuario\.config\gcloud\service-account-key.json
```

#### 3. Actualizar .env
```bash
# Editar volume-api\.env
GOOGLE_APPLICATION_CREDENTIALS=C:\Users\tu-usuario\.config\gcloud\service-account-key.json
```

#### 4. Ejecutar el Sistema

##### PowerShell (Recomendado)
```powershell
# Terminal 1 - MCP Server (puerto 8081)
cd volume-mcp
.\mvnw.cmd spring-boot:run

# Terminal 2 - API Server (puerto 8080)
cd volume-api
$env:GOOGLE_APPLICATION_CREDENTIALS="$env:USERPROFILE\.config\gcloud\service-account-key.json"
$env:GOOGLE_CLOUD_PROJECT_ID="tu-project-id"
$env:GEMINI_API_KEY="tu-api-key"
.\mvnw.cmd spring-boot:run
```

##### Command Prompt
```cmd
REM Terminal 1 - MCP Server
cd volume-mcp
mvnw.cmd spring-boot:run

REM Terminal 2 - API Server
cd volume-api
set GOOGLE_APPLICATION_CREDENTIALS=%USERPROFILE%\.config\gcloud\service-account-key.json
set GOOGLE_CLOUD_PROJECT_ID=tu-project-id
set GEMINI_API_KEY=tu-api-key
mvnw.cmd spring-boot:run
```

### 🧪 Probar el Sistema

#### Con curl (Linux/Windows con curl instalado)
```bash
# Probar lista de instrumentos
curl -X POST http://localhost:8080/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "¿Qué instrumentos están disponibles?"}'

# Probar configuración de volumen
curl -X POST http://localhost:8080/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "Configura el volumen de guitarra a 75"}'

# Probar respuesta fuera de scope
curl -X POST http://localhost:8080/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "¿Cuál es la capital de Francia?"}'
```

#### Con PowerShell (Windows)
```powershell
# Probar lista de instrumentos
$body = @{ question = "¿Qué instrumentos están disponibles?" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8080/chat" -Method POST -ContentType "application/json" -Body $body

# Probar configuración de volumen
$body2 = @{ question = "Configura el volumen de guitarra a 75" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8080/chat" -Method POST -ContentType "application/json" -Body $body2
```

### 📊 Respuestas Esperadas

- **✅ Instrumentos disponibles**: "¡Los instrumentos disponibles son guitarra, voz, batería y bajo!"
- **✅ Configuración de volumen**: "¡Hecho! El volumen de la guitarra se ha configurado a 75."
- **✅ Pregunta fuera de scope**: "Lo siento, no puedo responder preguntas que no estén relacionadas con el volumen del mezclador."

### 🚨 Resolución de Problemas

#### Error de credenciales
- Verificar que el archivo JSON existe en la ubicación especificada
- Confirmar que las variables de entorno están configuradas correctamente
- Asegurar que el proyecto de Google Cloud tiene la Vertex AI API habilitada

#### Puerto ocupado
```bash
# Linux/WSL
pkill -f "spring-boot:run"

# Windows
netstat -ano | findstr :8080
taskkill /PID <numero-pid> /F
```

#### Maven wrapper no funciona
- Verificar permisos de ejecución: `chmod +x mvnw` (Linux)
- Usar Maven global si está instalado: `mvn spring-boot:run`

### 🔧 Arquitectura del Sistema

El sistema consta de dos componentes principales:

1. **volume-mcp** (Puerto 8081): Servidor MCP que expone herramientas para:
   - Obtener lista de instrumentos disponibles
   - Configurar volumen de instrumentos específicos

2. **volume-api** (Puerto 8080): API REST que:
   - Integra con Gemini para procesamiento de lenguaje natural
   - Se conecta al servidor MCP para ejecutar acciones
   - Expone endpoint `/chat` para interacciones

### 🎯 Funcionalidades Implementadas

- **Chat con IA**: Interacción en lenguaje natural con Gemini
- **Control de Volumen**: Ajuste de volumen por instrumento
- **Lista de Instrumentos**: Consulta de instrumentos disponibles
- **Scope Limitado**: Solo responde preguntas relacionadas con audio
- **Arquitectura MCP**: Comunicación entre servicios usando Model Context Protocol

---

  - Este proyecto está bajo la licencia [Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/).
