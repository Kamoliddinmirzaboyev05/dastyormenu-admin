// ─── Staff Service ────────────────────────────────────────────────────────────

import { apiClient, ApiResponse } from './api';
import { PaginatedResponse } from './apiTypes';
import { UserProfile } from './types';

export interface CreateStaffRequest {
  organization: string;
  username: string;
  password: string;
  full_name: string;
  role: 'manager' | 'chef' | 'waiter';
  email?: string;
  pin_code?: string;
  is_active?: boolean;
}

export interface UpdateStaffRequest {
  username?: string;
  password?: string;
  full_name?: string;
  role?: 'manager' | 'chef' | 'waiter';
  email?: string;
  pin_code?: string;
  is_active?: boolean;
}

class StaffService {
  /**
   * Get all staff members (handles paginated response)
   */
  async getStaff(): Promise<ApiResponse<UserProfile[]>> {
    const response = await apiClient.get<PaginatedResponse<UserProfile>>('/api/users/');
    
    if (response.success && response.data) {
      // Extract results from paginated response
      return {
        success: true,
        data: response.data.results,
      };
    }
    
    return response as ApiResponse<UserProfile[]>;
  }

  /**
   * Create new staff member
   */
  async createStaff(data: CreateStaffRequest): Promise<ApiResponse<UserProfile>> {
    console.log('🔵 Creating staff:', data);
    
    return apiClient.post('/api/users/', {
      organization: data.organization,
      username: data.username,
      password: data.password,
      full_name: data.full_name,
      role: data.role,
      email: data.email || '',
      pin_code: data.pin_code || '',
      is_active: data.is_active !== undefined ? data.is_active : true,
    });
  }

  /**
   * Update staff member
   */
  async updateStaff(id: string, data: UpdateStaffRequest): Promise<ApiResponse<UserProfile>> {
    return apiClient.patch(`/api/users/${id}/`, data);
  }

  /**
   * Delete staff member
   */
  async deleteStaff(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/api/users/${id}/`);
  }

  /**
   * Toggle staff active status
   */
  async toggleActive(id: string, isActive: boolean): Promise<ApiResponse<UserProfile>> {
    return apiClient.patch(`/api/users/${id}/`, {
      is_active: !isActive,
    });
  }
}

export const staffService = new StaffService();
