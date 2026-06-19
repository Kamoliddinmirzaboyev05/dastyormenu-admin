// ─── Order Service ────────────────────────────────────────────────────────────
// Wraps the orders API and maps the backend payload to the shape the admin UI
// expects (nested table / waiter / order_items).

import { apiClient, ApiResponse } from './api';
import { PaginatedResponse } from './apiTypes';
import { Order, OrderStatus } from './types';

// Raw order as returned by the backend OrderSerializer.
interface BackendOrder {
  id: string;
  organization: string;
  table: string;
  table_number: number | null;
  waiter: string | null;
  waiter_name: string | null;
  status: OrderStatus;
  total_amount: number;
  tip_amount: number;
  tip_percentage: number;
  customer_note: string | null;
  total_with_tip?: number;
  completed_at: string | null;
  created_at: string;
  updated_at?: string;
  items?: Array<{
    id: string;
    menu: string;
    menu_name: string;
    menu_price: number;
    quantity: number;
    modifications: string | null;
    item_status: string;
  }>;
}

/** Map a backend order to the nested shape used across the admin UI. */
export function mapOrder(o: BackendOrder): Order {
  return {
    id: o.id,
    organization_id: o.organization,
    table_id: o.table,
    waiter_id: o.waiter,
    status: o.status,
    total_amount: o.total_amount,
    tip_amount: o.tip_amount,
    tip_percentage: o.tip_percentage,
    customer_note: o.customer_note,
    created_at: o.created_at,
    completed_at: o.completed_at,
    table: o.table_number != null ? ({ table_number: o.table_number } as Order['table']) : undefined,
    waiter: o.waiter_name ? ({ full_name: o.waiter_name } as Order['waiter']) : undefined,
    order_items: (o.items ?? []).map(it => ({
      id: it.id,
      order_id: o.id,
      menu_id: it.menu,
      menu_name: it.menu_name,
      menu_price: it.menu_price,
      quantity: it.quantity,
      modifications: it.modifications,
      item_status: it.item_status,
    })),
  };
}

export interface GetOrdersParams {
  status?: OrderStatus | 'all';
  date?: string;      // YYYY-MM-DD — limits to that calendar day
  tableId?: string;
}

class OrderService {
  /** Fetch orders (paginated) and map them to the UI shape. */
  async getOrders(params: GetOrdersParams = {}): Promise<ApiResponse<Order[]>> {
    const qs = new URLSearchParams();
    if (params.status && params.status !== 'all') qs.append('status', params.status);
    if (params.tableId) qs.append('table_id', params.tableId);
    if (params.date) {
      qs.append('date_from', `${params.date}T00:00:00`);
      qs.append('date_to', `${params.date}T23:59:59`);
    }
    qs.append('ordering', '-created_at');

    const response = await apiClient.get<PaginatedResponse<BackendOrder>>(
      `/api/orders/?${qs.toString()}`
    );

    if (response.success && response.data) {
      return { success: true, data: response.data.results.map(mapOrder) };
    }
    return response as unknown as ApiResponse<Order[]>;
  }

  /** Move an order to a new status (validated state machine on the backend). */
  async updateStatus(id: string, status: OrderStatus): Promise<ApiResponse<Order>> {
    const response = await apiClient.post<BackendOrder>(
      `/api/orders/${id}/update_status/`,
      { status }
    );

    if (response.success && response.data) {
      return { success: true, data: mapOrder(response.data) };
    }
    return response as unknown as ApiResponse<Order>;
  }
}

export const orderService = new OrderService();
