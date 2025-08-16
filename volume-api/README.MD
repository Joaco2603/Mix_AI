# 🪟 Configuración de Gemini para Windows

## Prerequisitos
- JDK 21 instalado
- Git clone del repositorio completo
- PowerShell o Command Prompt

## Pasos de Configuración

### 1. Verificar/Instalar JDK 21
powershell
# Verificar JDK actual
java -version

# Si no tienes JDK 21, descargar desde:
# https://adoptium.net/temurin/releases/?version=21


### 2. Configurar Google Cloud Credentials

#### Opción A: Usar credenciales existentes (recomendado)
powershell
# 1. Crear directorio (PowerShell)
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.config\gcloud"

# 2. Solicitar el archivo service-account-key.json al administrador
# 3. Colocarlo en: C:\Users\TU_USUARIO\.config\gcloud\service-account-key.json


#### Opción B: Crear propias credenciales
1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Seleccionar proyecto: gen-lang-client-0182236257
3. Crear Service Account con rol "Vertex AI User"
4. Descargar JSON key
5. Actualizar path en .env

### 3. Configurar archivo .env
El archivo volume-api\.env debe contener:
bash
GEMINI_API_KEY=${GEMINI_API_KEY}
$env:GOOGLE_APPLICATION_CREDENTIALS="$env{TU_PATH_A_LAS_CREDENCIALES_AQUI}/service-account-key.json
GOOGLE_CLOUD_PROJECT_ID=gen-lang-client-0182236257

*⚠️ Importante:* Cambiar TU_USUARIO por tu username real de Windows.

### 4. Ejecutar el Sistema

#### Método 1: PowerShell (Recomendado)
powershell
# Terminal 1 - MCP Server (puerto 8081)
cd volume-mcp
.\mvnw.cmd spring-boot:run

# Terminal 2 - API Server (puerto 8080)
cd volume-api
$env:GOOGLE_APPLICATION_CREDENTIALS="$env{TU_PATH_A_LAS_CREDENCIALES_AQUI}/service-account-key.json
$env:GOOGLE_CLOUD_PROJECT_ID=${TU_PROJECT_ID_AQUI}
$env:GEMINI_API_KEY=gen-lang-client-${GEMINI_API_KEY}
.\mvnw.cmd spring-boot:run


#### Método 2: Command Prompt (CMD)
cmd
REM Terminal 1 - MCP Server
cd volume-mcp
mvnw.cmd spring-boot:run

REM Terminal 2 - API Server
cd volume-api
set GOOGLE_APPLICATION_CREDENTIALS=%${TU_PATH_A_LAS_CREDENCIALES_AQUI}/service-account-key.json
set GOOGLE_CLOUD_PROJECT_ID=gen-lang-client-${TU_PROJECT_ID_AQUI}
set GEMINI_API_KEY=${GEMINI_API_KEY}
mvnw.cmd spring-boot:run


### 5. Probar Funcionamiento

#### Con curl (si está instalado)
powershell
# Probar lista de instrumentos
curl -X POST http://localhost:8080/chat `
  -H "Content-Type: application/json" `
  -d '{"question": "¿Qué instrumentos están disponibles?"}'

# Probar configuración de volumen  
curl -X POST http://localhost:8080/chat `
  -H "Content-Type: application/json" `
  -d '{"question": "Configura el volumen de guitarra a 75"}'


#### Con PowerShell (sin curl)
powershell
# Probar lista de instrumentos
$body = @{
    question = "¿Qué instrumentos están disponibles?"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/chat" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body

# Probar configuración de volumen
$body2 = @{
    question = "Configura el volumen de guitarra a 75"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/chat" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body2


## ✅ Verificación de Éxito
- Ambos servicios inician sin errores
- MCP Tools se descubren correctamente
- Las pruebas funcionan correctamente
- Gemini responde apropiadamente

## 🚨 Problemas Comunes

### Error de credenciales
powershell
# Verificar que el archivo existe
Test-Path "$env:USERPROFILE\.config\gcloud\service-account-key.json"

# Verificar variable de entorno
echo $env:GOOGLE_APPLICATION_CREDENTIALS


### Puerto ocupado
powershell
# Encontrar procesos en puerto 8080/8081
netstat -ano | findstr :8080
netstat -ano | findstr :8081

# Matar proceso por PID
taskkill /PID NUMERO_PID /F


### Maven wrapper no funciona
powershell
# Si mvnw.cmd no funciona, usar Maven global
mvn spring-boot:run


## 📝 Notas Importantes

1. *Rutas*: Windows usa \ en lugar de /
2. *Variables*: En PowerShell usar $env:, en CMD usar set
3. *Scripts*: Usar .bat o .ps1 en lugar de .sh
4. *Permisos*: Windows generalmente no requiere chmod
5. *curl*: Si no está instalado, usar Invoke-RestMethod en PowerShell

## 🔧 Alternativa con Variables de Sistema

Para configurar permanentemente las variables de entorno:

1. *Windows + R* → sysdm.cpl
2. *Advanced* → *Environment Variables*
3. Agregar en *User variables*:
   - GOOGLE_APPLICATION_CREDENTIALS: ${TU_PATH_A_LAS_CREDENCIALES_AQUI}/service-account-key.json
   - GOOGLE_CLOUD_PROJECT_ID: gen-lang-client-${TU_PROJECT_ID_AQUI}
   - GEMINI_API_KEY: ${GEMINI_API_KEY}

Después de esto, solo necesitas:
cmd
cd volume-api
mvnw.cmd spring-boot:run