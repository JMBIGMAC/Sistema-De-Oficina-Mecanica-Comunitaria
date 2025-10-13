// Detecta dinamicamente o host do backend para ambientes locais/remotos

const getApiBaseUrl = () => {
  if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
  const { protocol, hostname } = window.location;
  // Detecta Codespaces/GitHub dev environments
  if (hostname.endsWith('.github.dev')) {
    // Substitui a porta 3000 por 8000 no subdomínio
    return `${protocol}//${hostname.replace('-3000', '-8000')}/api`;
  }
  return `${protocol}//${hostname}:8000/api`;
};

const API_BASE_URL = getApiBaseUrl();

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('token');
    // Não envia Authorization para login ou signup
    const isAuthRoute = endpoint === '/auth/login/' || endpoint === '/auth/signup/';
    // Garante que headers seja sempre um objeto simples
    const baseHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    let extraHeaders: Record<string, string> = {};
    if (options.headers) {
      if (options.headers instanceof Headers) {
        // Converte Headers para objeto simples
        extraHeaders = Object.fromEntries((options.headers as Headers).entries());
      } else if (typeof options.headers === 'object' && !Array.isArray(options.headers)) {
        extraHeaders = options.headers as Record<string, string>;
      }
    }
    const headers: Record<string, string> = {
      ...baseHeaders,
      ...extraHeaders,
    };
    if (token && !isAuthRoute) {
      headers['Authorization'] = `Token ${token}`;
    }
    const config: RequestInit = {
      headers,
      ...options,
    };
    try {
      const response = await fetch(url, config);
      const data = await response.json();
      if (!response.ok) {
        return {
          error: data.error || data.detail || `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
        };
      }
      return {
        data,
        status: response.status,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error occurred',
        status: 0,
      };
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/health/');
  }

  // Authentication endpoints
  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async signup(userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) {
    return this.request('/auth/signup/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getUserProfile() {
    return this.request('/auth/profile/');
  }

  // Utility methods
  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  removeToken() {
    localStorage.removeItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }
}

export const apiService = new ApiService();
export default apiService;