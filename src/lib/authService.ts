// ─── Auth Service ─────────────────────────────────────────────────────────────

import { apiClient, ApiResponse } from './api';
import { LoginResponse, RefreshTokenResponse, MeResponse } from './apiTypes';
import { UserProfile, Organization } from './types';

export interface LoginRequest {
  login: string;
  password: string;
}

class AuthService {
  /**
   * Login with username/email and password
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<any>('/api/auth/login/', credentials);
    
    if (response.success && response.data) {
      console.log('📦 Raw backend response:', response.data);
      
      // Handle nested user structure from backend
      const userData = response.data.user?.user || response.data.user;
      const organizationData = response.data.user?.organization || response.data.organization;
      
      console.log('👤 User data:', userData);
      console.log('🏢 Organization data:', organizationData);
      
      // Transform to expected format
      const transformedData: LoginResponse = {
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
        user: {
          id: userData.id || response.data.user?.id,
          username: userData.username,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          role: response.data.user?.role || 'manager',
          is_active: response.data.user?.is_active ?? true,
          created_at: response.data.user?.created_at,
          updated_at: response.data.user?.updated_at,
          full_name: response.data.user?.full_name || `${userData.first_name} ${userData.last_name}`,
        },
        organization: {
          id: typeof organizationData === 'string' ? organizationData : organizationData?.id,
          full_name: response.data.user?.full_name || `${userData.first_name} ${userData.last_name}`,
          role: response.data.user?.role || 'manager',
          is_active: response.data.user?.is_active ?? true,
          created_at: response.data.user?.created_at,
          updated_at: response.data.user?.updated_at,
        }
      };
      
      console.log('✅ Transformed data:', transformedData);
      
      // Save tokens to localStorage (persistent across sessions and updates)
      localStorage.setItem('dastyor_token', transformedData.access_token);
      localStorage.setItem('dastyor_refresh_token', transformedData.refresh_token);
      
      // Save user and organization data
      localStorage.setItem('dastyor_auth', JSON.stringify({
        user: transformedData.user,
        organization: transformedData.organization,
      }));
      
      console.log('💾 Data saved to localStorage');
      
      return {
        success: true,
        data: transformedData
      };
    }
    
    return response;
  }

  /**
   * Logout and clear all auth data
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint (optional, for server-side cleanup)
      await apiClient.post('/api/auth/logout/');
    } catch (error) {
      // Ignore errors on logout
      console.error('Logout error:', error);
    } finally {
      // Always clear session storage
      this.clearAuthData();
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<ApiResponse<RefreshTokenResponse>> {
    const response = await apiClient.post<RefreshTokenResponse>('/api/auth/refresh/');
    
    if (response.success && response.data) {
      localStorage.setItem('dastyor_token', response.data.access_token);
    }
    
    return response;
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<ApiResponse<MeResponse>> {
    return apiClient.get('/api/auth/me/');
  }

  /**
   * Verify if user is authenticated
   */
  async verifyAuth(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await this.getCurrentUser();
      
      if (response.success && response.data) {
        // Update stored user data
        localStorage.setItem('dastyor_auth', JSON.stringify({
          user: response.data.user,
          organization: response.data.organization,
        }));
        return true;
      }
      
      // Only clear auth data if it's an authentication error (401)
      if (response.error?.status === 401) {
        console.log('❌ Token invalid (401), clearing auth data');
        this.clearAuthData();
        return false;
      }
      
      // For other errors (network, 500, etc), keep the token
      console.log('⚠️ Verification failed but keeping auth data:', response.error);
      return true; // Keep user logged in on network errors
    } catch (error) {
      // Network error - don't clear auth data
      console.log('⚠️ Network error during verification, keeping auth data');
      return true; // Keep user logged in
    }
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem('dastyor_token');
  }

  /**
   * Get stored user and organization data
   */
  getStoredAuth(): { user: UserProfile; organization: Organization } | null {
    try {
      const stored = localStorage.getItem('dastyor_auth');
      if (!stored) return null;
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  /**
   * Clear all auth data from storage
   */
  clearAuthData(): void {
    localStorage.removeItem('dastyor_token');
    localStorage.removeItem('dastyor_refresh_token');
    localStorage.removeItem('dastyor_auth');
    localStorage.removeItem('dastyor_saved_login');
  }

  /**
   * Check if user is authenticated (has token)
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
