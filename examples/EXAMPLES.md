# Ejemplos de uso rápidos

Este documento muestra ejemplos sencillos para probar el sistema localmente (API, MCP y firmware).

## 1) Levantar servicios (desarrollo)

- MCP server (puerto 8081):

```bash
cd models/volume-mcp
./mvnw spring-boot:run
```

- API server (puerto 8080):

```bash
cd software/volume-api
export GOOGLE_APPLICATION_CREDENTIALS="$HOME/.config/gcloud/service-account-key.json"
export GOOGLE_CLOUD_PROJECT_ID="tu-project-id"
export GEMINI_API_KEY="tu-api-key"
./mvnw spring-boot:run
```

- Frontend (Next.js):

```bash
cd software/frontend-client
npm install
npm run dev
# http://localhost:3000
```

## 2) Probar el endpoint `/chat` (API)

- Lista de instrumentos (ejemplo):

```bash
curl -X POST http://localhost:8080/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "¿Qué instrumentos están disponibles?"}'
```

- Configurar volumen vía chat (API -> MCP -> firmware):

```bash
curl -X POST http://localhost:8080/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "Configura el volumen de guitarra a 75"}'
```

La API traducirá la intención y, si corresponde, invocará al MCP para aplicar el cambio en el hardware.

## 3) Llamada directa (ejemplo) al firmware / MCP

El MCP internamente usa un `baseUrl` para el firmware (p.ej. `http://192.168.0.4/`). Puedes probar la llamada directa que el MCP hace al firmware (form data):

```bash
curl -X POST http://192.168.0.4/volume \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "value=75&channel=1"
```

Para silenciar un canal (mute):

```bash
curl -X POST http://192.168.0.4/muteChannel \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "channel=1&mute=true"
```

Nota: reemplaza `192.168.0.4` por la IP real del ESP32/firmware en tu red.

## 4) Probar reproducción desde SD (firmware)

- Ingresa al firmware (serial) para ver logs de reproducción o usa la UI del M5Stack (si está disponible).
- Los archivos WAV de ejemplo se colocan en la tarjeta SD en rutas como `/guitar_output.wav`.

## 5) Ejemplo rápido de flujo (resumen)

1. Usuario envía comando por la UI (Frontend).
2. Frontend llama `POST /chat` en `volume-api`.
3. `volume-api` consulta LLM (Gemini) y decide la acción.
4. Si hay acción hardware, `volume-api` solicita a `volume-mcp` ejecutar la acción.
5. `volume-mcp` hace un POST al firmware (p.ej. `/volume`) que ajusta el `AudioMixer`.

---
