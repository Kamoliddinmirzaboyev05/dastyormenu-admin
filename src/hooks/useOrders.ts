import { useMemo } from 'react';
import { Order, OrderStatus } from '../lib/types';
import { useAuthStore } from '../store/authStore';
import { orderService } from '../lib/orderService';
import { useQuery } from './useQuery';

interface UseOrdersOptions {
  status?: OrderStatus | 'all';
  date?: string;
  tableId?: string;
}

const ordersKey = (o: UseOrdersOptions) =>
  `orders:${o.status ?? 'all'}:${o.date ?? ''}:${o.tableId ?? ''}`;

export function useOrders(options: UseOrdersOptions = {}) {
  const { organization } = useAuthStore();

  const query = useQuery<Order[]>({
    key: ordersKey(options),
    fetcher: () => orderService.getOrders({ status: options.status, date: options.date, tableId: options.tableId }),
    enabled: !!organization,
  });

  return {
    orders: query.data ?? [],
    loading: query.loading,
    error: query.error,
    refetch: query.refetch,
  };
}

const ACTIVE_STATUSES: OrderStatus[] = ['pending', 'cooking', 'ready'];

export function useTodayStats() {
  const { organization } = useAuthStore();
  const today = new Date().toISOString().split('T')[0];

  const query = useQuery<Order[]>({
    key: `orders:stats:${today}`,
    fetcher: () => orderService.getOrders({ date: today }),
    enabled: !!organization,
  });

  const stats = useMemo(() => {
    const orders = query.data ?? [];
    const todayRevenue = orders
      .filter((o) => o.status === 'completed')
      .reduce((sum, o) => sum + o.total_amount, 0);
    const activeOrders = orders.filter((o) => ACTIVE_STATUSES.includes(o.status)).length;
    return {
      todayRevenue,
      todayOrders: orders.length,
      activeOrders,
      todayCustomers: new Set(orders.map((o) => o.table_id)).size,
      revenueChange: 0,
      ordersChange: 0,
    };
  }, [query.data]);

  return { stats, loading: query.loading, refetch: query.refetch };
}
