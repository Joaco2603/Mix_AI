# Tests - Pruebas del Proyecto MIX IA

Este directorio contiene todas las pruebas unitarias, de integración y end-to-end del proyecto MIX IA.

## Estructura de Pruebas

```
tests/
├── unit/           # Pruebas unitarias por componente
├── integration/    # Pruebas de integración entre servicios
├── mocks/          # Mocks y stubs para testing
├── e2e/           # Pruebas end-to-end completas
└── README.md      # Este archivo
```

## Tipos de Pruebas

### Pruebas Unitarias (`unit/`)
- **Backend API**: Validación de controladores, servicios y lógica de negocio
- **MCP Server**: Testing de comunicación con firmware y manejo de comandos
- **Frontend**: Componentes React, hooks y utilidades
- **Firmware**: Lógica de audio mixer, web server y gestión de archivos

### Pruebas de Integración (`integration/`)
- **API ↔ MCP**: Comunicación entre volume-api y volume-mcp
- **MCP ↔ Firmware**: Comandos HTTP hacia el ESP32
- **Frontend ↔ API**: Flujo completo de chat y comandos
- **LLM Integration**: Testing con Gemini y respuestas esperadas

### Mocks (`mocks/`)
- **Mock Firmware**: Simulador del ESP32 para testing sin hardware
- **Mock LLM**: Respuestas predefinidas para pruebas deterministas
- **Mock Audio**: Simulación de archivos WAV y estado del mixer

### End-to-End (`e2e/`)
- **Flujo completo**: Usuario → Frontend → API → MCP → Firmware
- **Casos de uso reales**: Comandos de voz/texto completos
- **Testing con hardware real**: Validación en ESP32 físico

## Ejecutar Pruebas

### Backend (Java)
```bash
# Volume API
cd software/volume-api
./mvnw test

# Volume MCP
cd models/volume-mcp
./mvnw test
```

### Frontend (Next.js)
```bash
cd software/frontend-client
npm test
npm run test:e2e
```

### Firmware (PlatformIO)
```bash
cd microcontroller-firmware
pio test
```

### Todas las pruebas
```bash
# Desde la raíz del proyecto
npm run test:all    # Si configuramos script global
```

## Configuración de Testing

### Variables de Entorno para Testing
```bash
# Para pruebas de integración
GEMINI_API_KEY=test_key_here
FIRMWARE_BASE_URL=http://localhost:3001  # Mock firmware
TEST_MODE=true
```

### Coverage
- **Objetivo**: >80% coverage en componentes críticos
- **Herramientas**: JaCoCo (Java), Jest (Frontend), lcov (C++)

## Mocks Disponibles

### Mock Firmware Server
Servidor HTTP que simula las respuestas del ESP32:
```bash
cd tests/mocks
node mock-firmware-server.js
# Escucha en http://localhost:3001
```

### Mock LLM Responses
Respuestas predefinidas para comandos comunes:
- "sube el volumen del piano"
- "mutea la batería"
- "lista los instrumentos"

## CI/CD Integration

Las pruebas se ejecutan automáticamente en GitHub Actions:
- **On Push**: Pruebas unitarias e integración
- **On PR**: Pruebas completas incluyendo E2E
- **Nightly**: Pruebas con hardware real (si disponible)

## Contribuir con Pruebas

1. **Nuevas features**: Añadir pruebas unitarias mínimo
2. **Bug fixes**: Incluir test que reproduzca el bug
3. **Integration**: Validar comunicación entre servicios
4. **Naming**: Usar nombres descriptivos (`should_increase_volume_when_piano_command_received`)

Ver `CONTRIBUTING.md` para más detalles sobre estándares de testing.
