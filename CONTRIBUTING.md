# Contribuir al proyecto MIX AI

Gracias por querer contribuir. Aquí encontrarás un resumen rápido de cómo reportar problemas, proponer mejoras y enviar cambios (Pull Requests).

## 1) Antes de empezar
- Revisa el `README.md` y `CHANGELOG.MD` para entender el estado actual del proyecto.
- Consulta las plantillas en `docs/.github/` (`PULL_REQUEST_TEMPLATE.md` y `ISSUE_TEMPLATE/`) antes de crear PRs o Issues.

## 2) Reportar un issue
- Usa la plantilla `bug_report.md` para errores y `feature_request.md` para nuevas funcionalidades.
- Proporciona: pasos para reproducir, resultado esperado, logs relevantes, versión/commit y captura(s) si aplica.

## 3) Trabajar en una rama (branch)
- Haz forks si no tienes permisos de push directo.
- Crea ramas con nombre claro: `feat/<descripción>`, `fix/<descripción>`, `chore/<descripción>`.
  Ejemplo: `feat/frontend-chat-transcription` o `fix/mcp-setvolume-endpoint`.

## 4) Commits
- Sigue un formato claro (por ejemplo, Conventional Commits):
  - `feat: añadir soporte para Gemini` 
  - `fix: corregir null pointer en AudioPlayer`
- Mensajes cortos en la primera línea (<= 72 caracteres) y, si es necesario, una descripción más larga después de una línea en blanco.

## 5) Pull Request (PR)
- Abre PRs contra la rama `main` (o la rama que se indique en la política del proyecto).
- Completa la plantilla de PR: qué hace, cómo probar, checklist.
- Incluye referencias a issues relacionados: `Closes #123`.
- Asegúrate de que los cambios son pequeños y enfocados (1 motivo por PR cuando sea posible).

## 6) Pruebas y verificación local
- Para la API (Java / Spring Boot):
- Ejecuta: `cd software/volume-api && ./mvnw spring-boot:run`
- Ejecuta pruebas unitarias: `./mvnw test`
- Para el MCP: `cd models/volume-mcp && ./mvnw spring-boot:run`
- Para el frontend (Next.js):
- `cd software/frontend-client && npm install && npm run dev`
- Para el firmware (PlatformIO / Arduino): sigue las instrucciones en `software/microcontroller-firmware/README.md`.

## 7) Estilo y linters
- Respeta la convención de código del subproyecto (Java: Spring style; JS/TS: ESLint/Prettier si aplica).
- Añade o actualiza tests cuando corresponda.

## 8) Revisión y aprobación
- Asignaremos revisores automáticamente o los asignará el mantenedor.
- Responde a los comentarios de revisión y actualiza el PR.
- El PR será mergeado una vez pase las revisiones y CI (si aplica).

## 9) Seguridad y secretos
- No subas claves, contraseñas ni archivos de credenciales al repositorio.
- Usa variables de entorno y `volume-api/.env` local para credenciales.

## 10) Contacto
- Para dudas rápidas, abre un issue y etiquétalo como `question` o contacta a los mantenedores listados en el `README.md`.

Gracias por contribuir — tus aportes ayudan a que MIX AI mejore y sea más robusto.
