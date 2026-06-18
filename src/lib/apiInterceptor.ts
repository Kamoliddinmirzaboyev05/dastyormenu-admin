// ─── API Interceptor ──────────────────────────────────────────────────────────
// Handles token refresh and authentication errors

import { authService } from './authService';

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}


function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
}

export async function handleAuthError(response: Response): Promise<Response> {
  // Only handle 401 Unauthorized errors
  if (response.status !== 401) {
    return response;
  }

  // Don't try to refresh on login/logout endpoints
  const url = response.url;
  if (url.includes('/auth/login') || url.includes('/auth/logout') || url.includes('/auth/refresh')) {
    return response;
  }

  // If already refreshing, wait for the new token
  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeTokenRefresh((token: string) => {
        // Retry the original request with new token
        const originalRequest = response.clone();
        fetch(originalRequest.url, {
          ...originalRequest,
          headers: {
            ...Object.fromEntries(originalRequest.headers.entries()),
            'Authorization': `Bearer ${token}`,
          },
        }).then(resolve);
      });
    });
  }

  isRefreshing = true;

  try {
    const refreshResponse = await authService.refreshToken();
    
    if (refreshResponse.success && refreshResponse.data) {
      const newToken = refreshResponse.data.access_token; // ✅ access_token
      isRefreshing = false;
      onTokenRefreshed(newToken);

      // Retry the original request with new token
      const originalRequest = response.clone();
      return fetch(originalRequest.url, {
        ...originalRequest,
        headers: {
          ...Object.fromEntries(originalRequest.headers.entries()),
          'Authorization': `Bearer ${newToken}`,
        },
      });
    } else {
      // Refresh failed, logout user
      isRefreshing = false;
      authService.clearAuthData();
      window.location.href = '/login';
      return response;
    }
  } catch (error) {
    isRefreshing = false;
    authService.clearAuthData();
    window.location.href = '/login';
    return response;
  }
}

// Setup global fetch interceptor
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const response = await originalFetch(...args);
  return handleAuthError(response);
};
