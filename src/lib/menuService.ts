// ─── Menu Service ─────────────────────────────────────────────────────────────

import { apiClient, ApiResponse } from './api';
import { PaginatedResponse } from './apiTypes';
import { Menu } from './types';

export interface CreateMenuRequest {
  name: string;
  description?: string;
  image?: File | string; // Changed from image_url to image
  price: number; // tiyin
  category: string;
  cook_time_minutes: number;
  ingredients?: string;
  is_available?: boolean;
  sort_order?: number;
}

export interface UpdateMenuRequest {
  category?: string;
  name?: string;
  description?: string;
  image?: File | string; // Changed from image_url to image
  price?: number; // tiyin
  cook_time_minutes?: number;
  ingredients?: string;
  is_available?: boolean;
  sort_order?: number;
}

class MenuService {
  /**
   * Get all menus (handles paginated response)
   */
  async getMenus(): Promise<ApiResponse<Menu[]>> {
    const response = await apiClient.get<PaginatedResponse<Menu>>('/api/menu/');
    
    if (response.success && response.data) {
      // Extract results from paginated response
      return {
        success: true,
        data: response.data.results,
      };
    }
    
    return response as ApiResponse<Menu[]>;
  }

  /**
   * Create new menu item
   */
  async createMenu(data: CreateMenuRequest): Promise<ApiResponse<Menu>> {
    const formData = new FormData();
    
    formData.append('name', data.name);
    formData.append('category', data.category);
    formData.append('price', data.price.toString());
    formData.append('cook_time_minutes', data.cook_time_minutes.toString());
    
    if (data.description) formData.append('description', data.description);
    if (data.ingredients) formData.append('ingredients', data.ingredients);
    if (data.is_available !== undefined) formData.append('is_available', data.is_available.toString());
    if (data.sort_order !== undefined) formData.append('sort_order', data.sort_order.toString());
    
    // Handle image - backend expects 'image' field with File
    if (data.image) {
      if (data.image instanceof File) {
        console.log('📸 Uploading image file:', data.image.name, data.image.type, data.image.size);
        formData.append('image', data.image, data.image.name);
      } else if (typeof data.image === 'string') {
        console.log('📸 Image URL (string):', data.image);
        formData.append('image', data.image);
      }
    } else {
      console.log('📸 No image provided');
    }

    console.log('🔵 Creating menu with FormData');
    // Log FormData contents
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: [File] ${value.name} (${value.size} bytes)`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }

    return apiClient.post('/api/menu/', formData);
  }

  /**
   * Update menu item
   */
  async updateMenu(id: string, data: UpdateMenuRequest): Promise<ApiResponse<Menu>> {
    console.log('🔵 menuService.updateMenu called:', { id, data });
    
    const formData = new FormData();
    
    if (data.category) formData.append('category', data.category);
    if (data.name) formData.append('name', data.name);
    if (data.description !== undefined) formData.append('description', data.description);
    if (data.price !== undefined) formData.append('price', data.price.toString());
    if (data.cook_time_minutes !== undefined) formData.append('cook_time_minutes', data.cook_time_minutes.toString());
    if (data.ingredients !== undefined) formData.append('ingredients', data.ingredients);
    if (data.is_available !== undefined) formData.append('is_available', data.is_available.toString());
    if (data.sort_order !== undefined) formData.append('sort_order', data.sort_order.toString());
    
    // Handle image
    if (data.image) {
      if (data.image instanceof File) {
        console.log('📸 Updating with image file:', data.image.name, data.image.type, data.image.size);
        formData.append('image', data.image, data.image.name);
      } else if (typeof data.image === 'string') {
        console.log('📸 Updating with image URL (string):', data.image);
        formData.append('image', data.image);
      }
    } else {
      console.log('📸 No new image provided for update');
    }

    console.log('🔵 Updating menu with FormData:');
    // Log FormData contents
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: [File] ${value.name} (${value.size} bytes)`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }

    const response = await apiClient.patch(`/api/menu/${id}/`, formData);
    console.log('📡 Update response:', response);
    
    return response;
  }

  /**
   * Delete menu item
   */
  async deleteMenu(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/api/menu/${id}/`);
  }

  /**
   * Toggle menu availability
   */
  async toggleAvailability(id: string, isAvailable: boolean): Promise<ApiResponse<Menu>> {
    const formData = new FormData();
    formData.append('is_available', (!isAvailable).toString());

    return apiClient.patch(`/api/menu/${id}/`, formData);
  }
}

export const menuService = new MenuService();
