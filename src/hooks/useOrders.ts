import { useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus } from '../lib/types';
import { useAuthStore } from '../store/authStore';
import { orderService } from '../lib/orderService';

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
      const response = await orderService.getOrders({
        status: options.status,
        date: options.date,
        tableId: options.tableId,
      });

      if (response.success) {
        setOrders(response.data || []);
      } else {
        setError(response.error?.message || 'Buyurtmalar yuklanmadi');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  }, [organization, options.status, options.date, options.tableId]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
}

const ACTIVE_STATUSES: OrderStatus[] = ['pending', 'cooking', 'ready'];

export function useTodayStats() {
  const { organization } = useAuthStore();
  const [stats, setStats] = useState({
    todayRevenue: 0,
    todayOrders: 0,
    activeOrders: 0,
    todayCustomers: 0,
    revenueChange: 0,
    ordersChange: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!organization) return;
    setLoading(true);

    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await orderService.getOrders({ date: today });
      const orders = response.success ? (response.data || []) : [];

      const todayRevenue = orders
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + o.total_amount, 0);

      const activeOrders = orders.filter(o => ACTIVE_STATUSES.includes(o.status)).length;

      setStats({
        todayRevenue,
        todayOrders: orders.length,
        activeOrders,
        todayCustomers: new Set(orders.map(o => o.table_id)).size,
        revenueChange: 0,
        ordersChange: 0,
      });
    } catch {
      // keep previous stats on error
    } finally {
      setLoading(false);
    }
  }, [organization]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  return { stats, loading, refetch: fetchStats };
}
