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
cd models/volume-mcp
./mvnw spring-boot:run

# Terminal 2 - API Server (puerto 8080)
cd software/volume-api
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
cd models/volume-mcp
.\mvnw.cmd spring-boot:run

# Terminal 2 - API Server (puerto 8080)
cd software/volume-api
$env:GOOGLE_APPLICATION_CREDENTIALS="$env:USERPROFILE\.config\gcloud\service-account-key.json"
$env:GOOGLE_CLOUD_PROJECT_ID="tu-project-id"
$env:GEMINI_API_KEY="tu-api-key"
.\mvnw.cmd spring-boot:run
```

##### Command Prompt
```cmd
REM Terminal 1 - MCP Server
cd models/volume-mcp
mvnw.cmd spring-boot:run

REM Terminal 2 - API Server
cd software/volume-api
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
