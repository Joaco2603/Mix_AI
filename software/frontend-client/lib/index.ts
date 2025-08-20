// lib/api/index.js
/**
 * lib/index.ts
 *
 * Punto único para crear y exportar el cliente HTTP usado por la UI. Para
 * cambiar el backend en desarrollo, actualizar `API_BASE_URL` o usar
 * variables de entorno según el despliegue.
 */
import { createHttpClient } from './adapter';

const API_BASE_URL = 'http://localhost:8080';
const httpClient = createHttpClient(API_BASE_URL, false);

export default httpClient;