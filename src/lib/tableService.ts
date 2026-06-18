// ─── Table Service ────────────────────────────────────────────────────────────

import { apiClient, ApiResponse } from './api';
import { PaginatedResponse } from './apiTypes';
import { Table } from './types';

export interface CreateTableRequest {
  organization: string;
  table_number: number;
  assigned_waiter?: string;
  is_active?: boolean;
}

export interface UpdateTableRequest {
  table_number?: number;
  assigned_waiter?: string;
  is_active?: boolean;
}

class TableService {
  /**
   * Get all tables (handles paginated response)
   */
  async getTables(): Promise<ApiResponse<Table[]>> {
    const response = await apiClient.get<PaginatedResponse<Table>>('/api/tables/');
    
    if (response.success && response.data) {
      // Extract results from paginated response
      return {
        success: true,
        data: response.data.results,
      };
    }
    
    return response as ApiResponse<Table[]>;
  }

  /**
   * Create new table
   */
  async createTable(data: CreateTableRequest): Promise<ApiResponse<Table>> {
    console.log('🔵 Creating table:', data);
    
    return apiClient.post('/api/tables/', {
      organization: data.organization,
      table_number: data.table_number,
      assigned_waiter: data.assigned_waiter || null,
      is_active: data.is_active !== undefined ? data.is_active : true,
    });
  }

  /**
   * Update table
   */
  async updateTable(id: string, data: UpdateTableRequest): Promise<ApiResponse<Table>> {
    return apiClient.patch(`/api/tables/${id}/`, data);
  }

  /**
   * Delete table
   */
  async deleteTable(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/api/tables/${id}/`);
  }

  /**
   * Assign waiter to table
   */
  async assignWaiter(tableId: string, waiterId: string | null): Promise<ApiResponse<Table>> {
    return apiClient.patch(`/api/tables/${tableId}/`, {
      assigned_waiter: waiterId,
    });
  }

  /**
   * Toggle table active status
   */
  async toggleActive(id: string, isActive: boolean): Promise<ApiResponse<Table>> {
    return apiClient.patch(`/api/tables/${id}/`, {
      is_active: !isActive,
    });
  }
}

export const tableService = new TableService();
