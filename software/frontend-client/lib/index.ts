// lib/api/index.js
import { createHttpClient } from './adapter';

const API_BASE_URL = 'http://localhost:8080';
const httpClient = createHttpClient(API_BASE_URL, false);

export default httpClient;