### Diagrama de Arquitectura
<<<<<<< HEAD
<img src="./assets/Diagrama_Arquitectura.png" width="1575" alt="Diagrama de Arquitectura" />
=======
<img src="docs/Diagrama_Arquitectura.png" width="1575" alt="Diagrama de Arquitectura" />
>>>>>>> 122384a318a4f112711a971912eab3eae974404e

El diagrama muestra la relación entre el Frontend (NextJS), la API (`volume-api`), el servidor MCP (`volume-mcp`) y el firmware del microcontrolador (ESP32). El flujo principal de comandos del usuario pasa por el Frontend hacia la API, que usa un cliente de chat (LLM) y solicita acciones al MCP para controlar el hardware.

## Vista general

El sistema se organiza en cuatro bloques principales:

- Frontend (NextJS): interfaz web para usuarios que envían comandos por voz o texto.
- API (`volume-api`): expone el endpoint `/chat`, integra con el LLM y actúa como orquestador.
- MCP (`volume-mcp`): servidor de herramientas que traduce intenciones a acciones sobre el hardware.
- Firmware (ESP32): ejecuta el `AudioMixer`, controla el PCM5102, sensores y provee estado.

## Capas del sistema

1. Percepción
   - Sensores y entradas: micrófonos, botones, sensores táctiles y lectura desde SD.
   - Recolección local de datos para estado y telemetría.

2. Procesamiento local (microcontrolador)
   - Mezcla y reproducción de audio en tiempo real (AudioMixer, AudioPlayer).
   - Lectura/escritura de archivos WAV desde SD.
   - Exposición de un WebServer local para estado y control.

3. Comunicación con el LLM (API/librerías)
   - `volume-api` formatea y envía prompts al LLM (Gemini/Vertex AI).
   - Uso de `spring-ai`/`ChatClient` para integrar con la capa de IA.

4. Toma de decisiones y acción
   - `volume-api` interpreta la intención y, si se requiere, invoca `volume-mcp`.
   - `volume-mcp` envía llamadas HTTP/REST al firmware (setVolume, muteChannel, etc.).

## Decisiones de diseño y mejoras posibles

1) Separación de responsabilidades
   - Mantener UI, orquestación (API/LLM) y control hardware desacoplados. Cada capa expone contratos claros (REST/JSON) para facilitar pruebas unitarias y despliegues independientes.
   - Definir una interfaz MCP estable (endpoints y payloads) para que firmware y servicios evolucionen sin romper compatibilidad.

2) Escalabilidad y despliegue
   - Empaquetar `volume-api` y `volume-mcp` como contenedores (Docker) y orquestarlos con Kubernetes para autoescalado y tolerancia a fallos.
   - Separar las cargas: mantener la carga del LLM en instancias que puedan ser escaladas horizontalmente o reemplazadas por adaptadores a servicios gestionados.

3) Latencia y rendimiento
   - Cachear intenciones y respuestas frecuentes para evitar llamadas repetidas al LLM.
   - Establecer budgets de latencia para las rutas críticas (comando→acción) y degradar a comportamientos locales si el LLM no responde a tiempo.
   - Optimizar buffers y tamaños de frames en el firmware para minimizar jitter y evitar underruns en audio.

4) Resiliencia y comunicaciones confiables
   - Implementar reintentos con backoff y confirmaciones en las comunicaciones MCP → firmware.
   - Diseñar mensajes idempotentes para evitar efectos indeseados en reintentos (por ejemplo, comandos de volumen con identificador de operación).
   - Monitorizar estados y exponer health-checks para cada servicio.

5) Seguridad y gestión de secretos
   - No incluir credenciales en el repo; usar gestores de secretos (Vault, Secret Manager) para Gemini API keys.
   - Asegurar el canal entre MCP y firmware (TLS o VPN) cuando sea posible, o al menos autenticación por tokens.

6) Operabilidad y observabilidad
   - Añadir métricas (Prometheus) y trazas distribuidas (OpenTelemetry) para trazar latencia desde el Frontend hasta la acción en el hardware.
   - Centralizar logs y alertas para detectar degradaciones (LLM, MCP, firmware).

7) Soporte offline y adaptadores de LLM
   - Diseñar un adaptador de LLM con interfaz única que permita intercambiar Gemini por un LLM local (Llama 3.x u otro) para operar sin conexión.
   - Implementar un modo degradado que ejecute reglas locales o prompts preprocesados cuando el servicio de LLM no esté disponible.

8) Firmware y actualizaciones
   - Definir un Hardware Abstraction Layer (HAL) en el firmware para aislar controladores (I2S, SD, UI) y facilitar pruebas unitarias.
   - Planificar OTA o procedimientos de actualización seguros del firmware para mejorar el mantenimiento en campo.

9) Pruebas y validación
   - Añadir pruebas integradas (integration tests) que simulen el flujo Frontend→API→MCP→firmware (hardware-in-the-loop o mock del firmware).
   - Crear suites de pruebas para audio (latencia, calidad, underrun) y validación de comandos del LLM.

10) Gestión de versiones y compatibilidad
   - Versionar la API MCP y documentar breaking changes.
   - Mantener un CHANGELOG y políticas de release para coordinar cambios entre firmware y servicios.
