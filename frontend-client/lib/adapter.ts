// lib/api/adapter.js
export interface HttpClient {
  get: (url: string, config?: RequestConfig) => Promise<any>;
  post: (url: string, data?: any, config?: RequestConfig) => Promise<any>;
  put: (url: string, data?: any, config?: RequestConfig) => Promise<any>;
  delete: (url: string, config?: RequestConfig) => Promise<any>;
}

export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
}

export class FetchAdapter implements HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get(url: string, config: RequestConfig = {}) {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'GET',
      headers: config.headers,
      next: { revalidate: 3600 }, // Opcional: para ISR en Next.js
    });
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    return response.json();
  }

  async post(url: string, data: any, config: RequestConfig = {}) {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...config.headers },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    return response.json();
  }

  async put(url: string, data: any, config: RequestConfig = {}) {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...config.headers },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    return response.json();
  }

  async delete(url: string, config: RequestConfig = {}) {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'DELETE',
      headers: config.headers,
    });
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    return response.json();
  }
}

export class AxiosAdapter implements HttpClient {
  private axios: any;

  constructor(baseUrl: string) {
    this.axios = require('axios').create({ baseURL: baseUrl });
    // Configuración global de Axios
    this.axios.interceptors.response.use(
      (response: any) => response.data,
      (error: any) => Promise.reject(error.response?.data || error.message)
    );
  }

  async get(url: string, config: RequestConfig = {}) {
    return this.axios.get(url, config);
  }

  async post(url: string, data: any, config: RequestConfig = {}) {
    return this.axios.post(url, data, config);
  }

  async put(url: string, data: any, config: RequestConfig = {}) {
    return this.axios.put(url, data, config);
  }

  async delete(url: string, config: RequestConfig = {}) {
    return this.axios.delete(url, config);
  }
}

// Fábrica para crear el cliente HTTP
export function createHttpClient(baseUrl: string, useAxios: boolean = false): HttpClient {
  return useAxios ? new AxiosAdapter(baseUrl) : new FetchAdapter(baseUrl);
}