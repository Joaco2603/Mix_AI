# 🪟 Configuración de Gemini para Windows

Guía paso a paso para desplegar el sistema Gemini (Mix_AI) en Windows, integrando servicios MCP y API, utilizando credenciales de Google Cloud y JDK 21.

---

## 🚀 Prerequisitos

- **Java JDK 21** instalado (descarga recomendada desde [Adoptium](https://adoptium.net/temurin/releases/?version=21))
- **Git** para clonar el repositorio
- Acceso a **PowerShell** o **Command Prompt (CMD)**
- Archivo de credenciales de Google Cloud (`service-account-key.json`)

---

## ⚙️ Pasos de Configuración

### 1. Verificar/Instalar JDK 21

```powershell
# Verificar versión actual
java -version
```
Si no tienes JDK 21, descárgalo e instálalo desde [Adoptium](https://adoptium.net/temurin/releases/?version=21).

---

### 2. Configurar Google Cloud Credentials

#### Opción A: Usar credenciales existentes (recomendado)

```powershell
# Crear directorio para credenciales
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.config\gcloud"
```
- Solicita el archivo `service-account-key.json` al administrador.
- Colócalo en:  
  `C:\Users\TU_USUARIO\.config\gcloud\service-account-key.json`

#### Opción B: Crear tus propias credenciales

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona el proyecto: `gen-lang-client-0182236257`
3. Crea una Service Account con rol **Vertex AI User**
4. Descarga el JSON key
5. Actualiza el path en tu archivo `.env`

---

### 3. Configurar archivo `.env`

Opción A. Crear el archivo `volume-api\.env` que debe contener:

```bash
GEMINI_API_KEY=${GEMINI_API_KEY}
GOOGLE_APPLICATION_CREDENTIALS=C:\Users\TU_USUARIO\.config\gcloud\service-account-key.json
GOOGLE_CLOUD_PROJECT_ID=gen-lang-client-0182236257
```
---

Opción B. Crear variables de entorno desde la terminal
```bash
$env:GEMINI_API_KEY="GEMINI_API_KEY"
$env:GOOGLE_CLOUD_PROJECT_ID="gen-lang-client-0182236257"
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\Users\TU_USUARIO\.config\gcloud\service-account-key.json"
```
> ⚠️ **Importante:** Cambia `TU_USUARIO` por tu username real de Windows.

### 4. Ejecutar el Sistema

#### Método 1: PowerShell (Recomendado)

```powershell
# Terminal 1 - MCP Server (puerto 8081)
cd volume-mcp
.\mvnw.cmd spring-boot:run

# Terminal 2 - API Server (puerto 8080)
# Nota: Si las variables de entorno ya están definidas en la sesión actual, puedes omitir ese paso.
cd volume-api
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\Users\TU_USUARIO\.config\gcloud\service-account-key.json"
$env:GOOGLE_CLOUD_PROJECT_ID="gen-lang-client-0182236257"
$env:GEMINI_API_KEY=${GEMINI_API_KEY}
.\mvnw.cmd spring-boot:run
```

#### Método 2: Command Prompt (CMD)

```cmd
REM Terminal 1 - MCP Server
cd volume-mcp
mvnw.cmd spring-boot:run

REM Terminal 2 - API Server
cd volume-api
set GOOGLE_APPLICATION_CREDENTIALS=C:\Users\TU_USUARIO\.config\gcloud\service-account-key.json
set GOOGLE_CLOUD_PROJECT_ID=gen-lang-client-0182236257
set GEMINI_API_KEY=${GEMINI_API_KEY}
mvnw.cmd spring-boot:run
```

---

### 5. Probar Funcionamiento

#### Con curl

```powershell
# Probar lista de instrumentos
curl -X POST http://localhost:8080/chat `
  -H "Content-Type: application/json" `
  -d '{"question": "¿Qué instrumentos están disponibles?"}'

# Probar configuración de volumen
curl -X POST http://localhost:8080/chat `
  -H "Content-Type: application/json" `
  -d '{"question": "Configura el volumen de guitarra a 75"}'
```

#### Con PowerShell (sin curl)

```powershell
# Probar lista de instrumentos
$body = @{ question = "¿Qué instrumentos están disponibles?" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8080/chat" -Method POST -ContentType "application/json" -Body $body

# Probar configuración de volumen
$body2 = @{ question = "Configura el volumen de guitarra a 75" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8080/chat" -Method POST -ContentType "application/json" -Body $body2
```

---

## ✅ Verificación de Éxito

- Ambos servicios inician sin errores
- MCP Tools se descubren correctamente
- Las pruebas funcionan correctamente
- Gemini responde apropiadamente

---

## 🚨 Problemas Comunes

### Error de credenciales

```powershell
# Verificar existencia del archivo
Test-Path "$env:USERPROFILE\.config\gcloud\service-account-key.json"
# Verificar variable de entorno
echo $env:GOOGLE_APPLICATION_CREDENTIALS
```

### Puerto ocupado

```powershell
netstat -ano | findstr :8080
netstat -ano | findstr :8081
# Matar proceso por PID
taskkill /PID NUMERO_PID /F
```

### Maven wrapper no funciona

```powershell
# Si mvnw.cmd falla, usa Maven global
mvn spring-boot:run
```

---

## 📝 Notas Importantes

1. **Rutas**: Windows usa `\` en vez de `/`
2. **Variables**: PowerShell usa `$env:`, CMD usa `set`
3. **Scripts**: Usa `.bat` o `.ps1`, no `.sh`
4. **Permisos**: Windows generalmente no requiere `chmod`
5. **curl**: Si no está instalado, usa `Invoke-RestMethod` en PowerShell

---

## 🔧 Alternativa: Variables de Sistema Permanentes

1. `Windows + R` → `sysdm.cpl`
2. Pestaña **Advanced** → **Environment Variables**
3. Agrega en **User variables**:
   - `GOOGLE_APPLICATION_CREDENTIALS`: `C:\Users\TU_USUARIO\.config\gcloud\service-account-key.json`
   - `GOOGLE_CLOUD_PROJECT_ID`: `gen-lang-client-0182236257`
   - `GEMINI_API_KEY`: `${GEMINI_API_KEY}`

Después, solo necesitas:

```cmd
cd volume-api
mvnw.cmd spring-boot:run
```