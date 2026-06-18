// ─── API Client ───────────────────────────────────────────────────────────────

import { ApiResponse, ApiError, API_MESSAGES } from './apiTypes';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://dastyormenu-backend-production.up.railway.app';
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;

export type { ApiResponse, ApiError };

class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string, timeout: number) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('dastyor_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const fullUrl = `${this.baseURL}${endpoint}`;
    console.log('🔵 API Request:', fullUrl, options.method || 'GET');

    try {
      const token = this.getAuthToken();
      const headers: Record<string, string> = {};

      // Only set Content-Type for JSON requests
      if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }

      // Add custom headers from options
      if (options.headers) {
        const customHeaders = options.headers as Record<string, string>;
        Object.assign(headers, customHeaders);
      }

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(fullUrl, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('🟢 API Response:', response.status, response.statusText);

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');

      if (!isJson) {
        // Server returned non-JSON response (likely HTML error page)
        console.error('❌ Server returned non-JSON response:', contentType);
        const text = await response.text();
        console.error('Response body:', text.substring(0, 200));
        
        return {
          success: false,
          error: {
            message: `Server xatosi: ${response.status} ${response.statusText}. Backend server ishlamayotgan bo'lishi mumkin.`,
            code: 'INVALID_RESPONSE',
            status: response.status,
          },
        };
      }

      const data = await response.json();
      console.log('📦 Response data:', data);

      if (!response.ok) {
        // Log detailed error for debugging
        console.error('❌ API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          data: data
        });

        // Handle specific error codes
        let errorMessage = data.detail || data.message || API_MESSAGES.ERROR;
        
        if (response.status === 500) {
          errorMessage = `Server xatosi: ${data.detail || 'Backend serverda xatolik yuz berdi. Backend loglarini tekshiring.'}`;
        } else if (response.status === 401) {
          errorMessage = data.detail || 'Login yoki parol noto\'g\'ri';
        } else if (response.status === 404) {
          errorMessage = 'API endpoint topilmadi. Backend URL ni tekshiring.';
        } else if (response.status === 422) {
          errorMessage = data.detail || 'Ma\'lumotlar noto\'g\'ri formatda';
        }

        return {
          success: false,
          error: {
            message: errorMessage,
            code: data.code,
            status: response.status,
            details: data.details || data,
          },
        };
      }

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      console.error('❌ API Error:', error);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            error: {
              message: API_MESSAGES.TIMEOUT,
              code: 'TIMEOUT',
            },
          };
        }

        // Check for JSON parse errors
        if (error.message.includes('JSON')) {
          return {
            success: false,
            error: {
              message: 'Server noto\'g\'ri javob qaytardi. Backend server to\'g\'ri ishlamayotgan bo\'lishi mumkin.',
              code: 'INVALID_JSON',
            },
          };
        }

        // Network errors (CORS, connection refused, etc)
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          return {
            success: false,
            error: {
              message: `Backend serverga ulanib bo'lmadi. Server ishlab turganini tekshiring: ${this.baseURL}`,
              code: 'NETWORK_ERROR',
            },
          };
        }

        return {
          success: false,
          error: {
            message: error.message || API_MESSAGES.NETWORK_ERROR,
            code: 'NETWORK_ERROR',
          },
        };
      }

      return {
        success: false,
        error: {
          message: 'Noma\'lum xatolik',
          code: 'UNKNOWN_ERROR',
        },
      };
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    // Check if body is FormData
    const isFormData = body instanceof FormData;
    
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
    });
  }

  async put<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    const isFormData = body instanceof FormData;
    
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
    });
  }

  async patch<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    const isFormData = body instanceof FormData;
    
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL, API_TIMEOUT);
