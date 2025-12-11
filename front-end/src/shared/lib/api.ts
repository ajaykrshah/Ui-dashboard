import type { AppConfig } from '@/config/app.config';

export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface ApiError {
  message: string;
  status: number;
  errors?: string[];
}

export class ApiClient {
  private config: AppConfig | null = null;
  private authToken: string | null = null;

  constructor() {
    // Initialize auth token from localStorage if available
    if (typeof window !== 'undefined') {
      this.authToken = localStorage.getItem('access_token');
    }
  }

  /**
   * Initialize the API client with runtime configuration
   */
  async initialize(config: AppConfig): Promise<void> {
    this.config = config;
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string | null): void {
    this.authToken = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('access_token', token);
      } else {
        localStorage.removeItem('access_token');
      }
    }
  }

  /**
   * Get current authentication token
   */
  getAuthToken(): string | null {
    return this.authToken;
  }

  /**
   * Build the full URL for an API endpoint
   */
  private buildUrl(endpoint: string): string {
    if (!this.config) {
      throw new Error('API client not initialized. Call initialize() first.');
    }
    const baseUrl = this.config.apiBaseUrl.replace(/\/$/, '');
    const cleanEndpoint = endpoint.replace(/^\//, '');
    return `${baseUrl}/${cleanEndpoint}`;
  }

  /**
   * Get default headers for API requests
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  /**
   * Handle API response and errors
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    let data: any;
    try {
      data = isJson ? await response.json() : await response.text();
      // if (isJson) data = camelizeKeys(data);
    } catch (error) {
      data = null;
    }

    if (!response.ok) {
      const apiError: ApiError = {
        message: data?.message || `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
        errors: data?.errors || [],
      };
      throw apiError;
    }

    return {
      data,
      success: true,
      message: data?.message,
    };
  }

  /**
   * Perform GET request
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = new URL(this.buildUrl(endpoint));

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Perform POST request
   */
  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    const requestInit: RequestInit = {
      method: 'POST',
      headers: this.getHeaders(),
    };

    if (body) {
      requestInit.body = JSON.stringify(body);
    }

    const response = await fetch(this.buildUrl(endpoint), requestInit);
    return this.handleResponse<T>(response);
  }

  /**
   * Perform PUT request
   */
  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    const requestInit: RequestInit = {
      method: 'PUT',
      headers: this.getHeaders(),
    };

    if (body) {
      requestInit.body = JSON.stringify(body);
    }

    const response = await fetch(this.buildUrl(endpoint), requestInit);
    return this.handleResponse<T>(response);
  }

  /**
   * Perform PATCH request
   */
  async patch<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    const requestInit: RequestInit = {
      method: 'PATCH',
      headers: this.getHeaders(),
    };

    if (body) {
      requestInit.body = JSON.stringify(body);
    }

    const response = await fetch(this.buildUrl(endpoint), requestInit);
    return this.handleResponse<T>(response);
  }

  /**
   * Perform DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(this.buildUrl(endpoint), {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }
}

// Global API client instance
export const apiClient = new ApiClient();
