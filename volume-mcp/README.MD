# 🎚️ Volume MCP

Este módulo implementa un servidor MCP (Model Context Protocol) en Spring Boot para exponer herramientas de control de volumen y gestión de instrumentos musicales, integrándose con sistemas de IA y otros servicios.

## 🚀 ¿Qué es Volume MCP?

Volume MCP es un microservicio que actúa como "tool server" MCP, permitiendo a otros sistemas (como LLMs o APIs de chat) consultar y modificar el estado de instrumentos musicales, especialmente su volumen, de forma programática y segura.

## 📦 Estructura del Proyecto

## ⚙️ Funcionalidades Principales

- Exposición de herramientas MCP para:
  - Listar instrumentos disponibles.
  - Cambiar el volumen de un instrumento específico.
- Diccionario de sinónimos para comandos en lenguaje natural.
- Comunicación con microcontroladores o sistemas remotos vía HTTP.
- Configuración sencilla vía `application.properties`.

## 🛠️ Tecnologías

- Java 21
- Spring Boot 3.x
- Spring AI MCP Server
- Lombok

## 🏁 Cómo ejecutar

1. **Clona el repositorio** y navega a la carpeta `volume-mcp`:

   ```bash
   git clone https://github.com/Joaco2603/MixAi_microcontroler.git
   cd MixAi_microcontroler/volume-mcp
   ```

2. **Ejecuta el proyecto** usando Maven:

   ```bash
   ./mvnw spring-boot:run
   ```

3. **Configura el puerto o parámetros**

application.properties en application.properties si lo necesitas.


*⚠️ Importante:* Cambiar TU_USUARIO por tu username real de Windows.


🧩 Ejemplo de Uso
El servicio expone herramientas MCP que pueden ser descubiertas por clientes compatibles (por ejemplo, un LLM conectado a través de Spring AI).
Puedes consultar los instrumentos disponibles o cambiar el volumen de uno de ellos mediante llamadas MCP.


📝 Notas
Este módulo está pensado para ser usado junto con volume-api y el microcontrolador.
El archivo application.properties permite ajustar el puerto y nivel de log.
Para desarrollo, puedes modificar la lista de instrumentos en VolumeRepository.


📄 Licencia
MIT License. Consulta el archivo LICENSE para más detalles.