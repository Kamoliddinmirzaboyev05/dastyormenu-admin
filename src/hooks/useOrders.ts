import { useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus } from '../lib/types';
import { useAuthStore } from '../store/authStore';

// Temporary mock data until orders API is integrated
const mockOrders: Order[] = [];
const mockOrderItems: any[] = [];
const mockTables: any[] = [];
const mockUsers: any[] = [];

interface UseOrdersOptions {
  status?: OrderStatus | 'all';
  date?: string;
  tableId?: string;
}

export function useOrders(options: UseOrdersOptions = {}) {
  const { organization } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!organization) return;
    setLoading(true);
    setError(null);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));

      let filtered = [...mockOrders].map(order => ({
        ...order,
        table: mockTables.find(t => t.id === order.table_id),
        waiter: mockUsers.find(u => u.id === order.waiter_id),
        order_items: mockOrderItems.filter(item => item.order_id === order.id),
      }));

      if (options.status && options.status !== 'all') {
        filtered = filtered.filter(o => o.status === options.status);
      }

      if (options.date) {
        filtered = filtered.filter(o => o.created_at.startsWith(options.date!));
      }

      if (options.tableId) {
        filtered = filtered.filter(o => o.table_id === options.tableId);
      }

      setOrders(filtered);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  }, [organization, options.status, options.date, options.tableId]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
}

export function useTodayStats() {
  const { organization } = useAuthStore();
  const [stats, setStats] = useState({
    todayRevenue: 0,
    todayOrders: 0,
    activeOrders: 0,
    todayCustomers: 0,
    revenueChange: 12,
    ordersChange: 5,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!organization) return;

    const fetchStats = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));

      const todayRevenue = mockOrders
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + o.total_amount, 0);

      const activeOrders = mockOrders.filter(o => 
        ['pending', 'cooking', 'ready'].includes(o.status)
      ).length;

      setStats({
        todayRevenue,
        todayOrders: mockOrders.length,
        activeOrders,
        todayCustomers: new Set(mockOrders.map(o => o.table_id)).size,
        revenueChange: 12,
        ordersChange: 5,
      });
      setLoading(false);
    };

    fetchStats();
  }, [organization]);

  return { stats, loading };
}
