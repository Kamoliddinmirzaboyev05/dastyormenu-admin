// ─── Category Service ─────────────────────────────────────────────────────────

import { apiClient, ApiResponse } from './api';
import { PaginatedResponse } from './apiTypes';
import { Category } from './types';

export interface CreateCategoryRequest {
  organization: string;
  name: string;
  icon?: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface UpdateCategoryRequest {
  name?: string;
  icon?: string;
  sort_order?: number;
  is_active?: boolean;
}

class CategoryService {
  /**
   * Get all categories (handles paginated response)
   */
  async getCategories(): Promise<ApiResponse<Category[]>> {
    const response = await apiClient.get<PaginatedResponse<Category>>('/api/categories/');
    
    if (response.success && response.data) {
      // Extract results from paginated response
      return {
        success: true,
        data: response.data.results,
      };
    }
    
    return response as ApiResponse<Category[]>;
  }

  /**
   * Create new category
   */
  async createCategory(data: CreateCategoryRequest): Promise<ApiResponse<Category>> {
    // Use FormData for multipart/form-data
    const formData = new FormData();
    formData.append('organization', data.organization);
    formData.append('name', data.name);
    if (data.icon) formData.append('icon', data.icon);
    if (data.sort_order !== undefined) formData.append('sort_order', data.sort_order.toString());
    if (data.is_active !== undefined) formData.append('is_active', data.is_active.toString());

    return apiClient.post('/api/categories/', formData, {
      headers: {
        // Don't set Content-Type, let browser set it with boundary
      }
    });
  }

  /**
   * Update category
   */
  async updateCategory(id: string, data: UpdateCategoryRequest): Promise<ApiResponse<Category>> {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.icon) formData.append('icon', data.icon);
    if (data.sort_order !== undefined) formData.append('sort_order', data.sort_order.toString());
    if (data.is_active !== undefined) formData.append('is_active', data.is_active.toString());

    return apiClient.patch(`/api/categories/${id}/`, formData, {
      headers: {}
    });
  }

  /**
   * Delete category
   */
  async deleteCategory(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/api/categories/${id}/`);
  }

  /**
   * Toggle category active status
   */
  async toggleActive(id: string, isActive: boolean): Promise<ApiResponse<Category>> {
    const formData = new FormData();
    formData.append('is_active', (!isActive).toString());

    return apiClient.patch(`/api/categories/${id}/`, formData, {
      headers: {}
    });
  }
}

export const categoryService = new CategoryService();
