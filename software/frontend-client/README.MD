<div align="center">
<img src="./public/MixAI.png" width="200" alt="AI Mix Logo" />
</div>
<h1 align="center">🚀 MIX AI</h1>

# 📄 Descripción

FrontEnt que usa los usuarios de las mixers de Mix AI, la primera mixer de audio con inteligencia artificial.

## 🚀 Empezando

Sigue estas instrucciones para obtener una copia de tu proyecto en funcionamiento en tu máquina local para propósitos de desarrollo y prueba.

### Requisitos Previos

Asegúrate de tener instalado lo siguiente:

* **Node.js**: Se recomienda la versión LTS.
* **npm** o **yarn**: Tu gestor de paquetes preferido.

### Instalación

1.  Clona el repositorio:

    ```bash
    git clone [https://github.com/tu-usuario/tu-proyecto.git](https://github.com/tu-usuario/tu-proyecto.git)
    ```

2.  Navega al directorio del proyecto:

    ```bash
    cd tu-proyecto
    ```

3.  Instala las dependencias:

    ```bash
    npm install
    # o
    yarn install
    ```

4.  Crea un archivo `.env.local` en la raíz del proyecto y añade tus variables de entorno. Aquí tienes un ejemplo:

    ```env
    # EJEMPLO DE VARIABLES DE ENTORNO
    NEXT_PUBLIC_API_URL=[https://api.ejemplo.com](https://api.ejemplo.com)
    DATABASE_URL=postgresql://user:password@localhost:5432/mydatabase
    ```

    **Nota:** Puedes referirte al archivo `.env.example` si existe.

## 🛠️ Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

* `npm run dev` o `yarn dev`: Inicia la aplicación en modo de desarrollo. Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado. Los cambios se actualizarán automáticamente.

* `npm run build` o `yarn build`: Crea una versión de producción de tu aplicación. El resultado se guarda en la carpeta `.next`.

* `npm run start` o `yarn start`: Inicia el servidor de producción. Este comando debe ser precedido por `npm run build`.

* `npm run lint` o `yarn lint`: Ejecuta el linter (ESLint) para identificar y reportar patrones problemáticos en tu código.

## 📁 Estructura del Proyecto

* `public/`: Almacena archivos estáticos como imágenes, fuentes e iconos.
* `components/`: Componentes reutilizables de React.
* `lib/` o `utils/`: Archivos de utilidades y funciones de ayuda.
* `styles/`: Estilos CSS, SCSS, o módulos de CSS.
* `hooks`: Hooks que facilitan el uso de funcionalidades en react



- Este proyecto está bajo la licencia [Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/).
