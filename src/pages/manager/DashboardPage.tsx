import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { DollarSign, ShoppingBag, Clock, Users } from 'lucide-react';
import StatCard from '../../components/UI/StatCard';
import StatusBadge from '../../components/UI/StatusBadge';
import { useTodayStats } from '../../hooks/useOrders';
import { Order, formatPrice } from '../../lib/types';
import { useAuthStore } from '../../store/authStore';
import { Skeleton } from '../../components/UI/LoadingSkeleton';

// ─── Weekly chart data ────────────────────────────────────────────────────────
const DAYS = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];

function getWeekDays() {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - 6 + i);
    return { day: DAYS[d.getDay()], date: d.toISOString().split('T')[0] };
  });
}

// ─── Hourly chart data ────────────────────────────────────────────────────────
const HOURS = Array.from({ length: 14 }, (_, i) => `${i + 10}:00`);

// ─── Custom tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-btn px-3 py-2 text-xs">
        <p className="text-[#A1A1AA] mb-1">{label}</p>
        <p className="text-[#F59E0B] font-semibold">{formatPrice(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const HourlyTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-btn px-3 py-2 text-xs">
        <p className="text-[#A1A1AA] mb-1">{label}</p>
        <p className="text-[#F59E0B] font-semibold">{payload[0].value} buyurtma</p>
      </div>
    );
  }
  return null;
};

// ─── Component ────────────────────────────────────────────────────────────────
const DashboardPage: React.FC = () => {
  const { organization } = useAuthStore();
  const orgId = organization?.id;
  const { stats, loading: statsLoading } = useTodayStats();

  const [weeklyData, setWeeklyData] = useState<{ day: string; revenue: number }[]>([]);
  const [hourlyData, setHourlyData] = useState<{ hour: string; orders: number }[]>([]);
  const [topMenus, setTopMenus] = useState<{ name: string; count: number }[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [chartsLoading, setChartsLoading] = useState(true);

  useEffect(() => {
    if (!orgId) return;

    const fetchCharts = async () => {
      setChartsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const weekDays = getWeekDays();

      // Mock data
      const ordersRes = { data: mockOrders };
      const itemsRes = { data: mockOrderItems };
      const recentRes = { data: mockOrders.map(o => ({
        ...o,
        table: mockTables.find(t => t.id === o.table_id),
        order_items: mockOrderItems.filter(item => item.order_id === o.id),
      })) };

      // Weekly revenue
      const revenueByDay: Record<string, number> = {};
      (ordersRes.data ?? []).forEach(o => {
        const day = o.created_at.split('T')[0];
        revenueByDay[day] = (revenueByDay[day] ?? 0) + o.total_amount;
      });
      setWeeklyData(weekDays.map(d => ({ day: d.day, revenue: revenueByDay[d.date] ?? 0 })));

      // Hourly orders (today)
      const today = new Date().toISOString().split('T')[0];
      const todayOrders = (ordersRes.data ?? []).filter(o => o.created_at.startsWith(today));
      const countByHour: Record<string, number> = {};
      todayOrders.forEach(o => {
        const h = new Date(o.created_at).getHours();
        const key = `${h}:00`;
        countByHour[key] = (countByHour[key] ?? 0) + 1;
      });
      setHourlyData(HOURS.map(h => ({ hour: h, orders: countByHour[h] ?? 0 })));

      // Top menus from order_items
      const menuCount: Record<string, number> = {};
      (itemsRes.data ?? []).forEach(item => {
        menuCount[item.menu_name] = (menuCount[item.menu_name] ?? 0) + item.quantity;
      });
      const sorted = Object.entries(menuCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
      setTopMenus(sorted.map(([name, count]) => ({ name, count })));

      setRecentOrders((recentRes.data as Order[]) ?? []);
      setChartsLoading(false);
    };

    fetchCharts();
  }, [orgId]);

  const maxHourly = Math.max(...hourlyData.map(d => d.orders), 1);

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Bugungi daromad" value={formatPrice(stats.todayRevenue)} change={stats.revenueChange} changeLabel="kechagiga nisbatan" icon={DollarSign} loading={statsLoading} />
        <StatCard title="Buyurtmalar soni" value={stats.todayOrders} change={stats.ordersChange} changeLabel="bugun" icon={ShoppingBag} loading={statsLoading} />
        <StatCard title="Faol buyurtmalar" value={stats.activeOrders} changeLabel="Jonli ma'lumot" icon={Clock} loading={statsLoading} />
        <StatCard title="Mijozlar soni" value={stats.todayCustomers} changeLabel="Bugun" icon={Users} loading={statsLoading} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weekly revenue */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-card p-5">
          <h3 className="text-sm font-semibold text-[#FAFAFA] mb-4">Haftalik daromad</h3>
          {chartsLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                <XAxis dataKey="day" tick={{ fill: '#A1A1AA', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#A1A1AA', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 100000).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={2} fill="url(#revenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Hourly orders */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-card p-5">
          <h3 className="text-sm font-semibold text-[#FAFAFA] mb-4">Soatlik band vaqtlar</h3>
          {chartsLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                <XAxis dataKey="hour" tick={{ fill: '#A1A1AA', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#A1A1AA', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<HourlyTooltip />} />
                <Bar dataKey="orders" radius={[4, 4, 0, 0]}
                  fill="#2A2A2A"
                  label={false}
                >
                  {hourlyData.map((entry, index) => (
                    <rect key={index} fill={entry.orders === maxHourly && entry.orders > 0 ? '#F59E0B' : '#3A3A3A'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Bottom panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top 5 menus */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-card p-5">
          <h3 className="text-sm font-semibold text-[#FAFAFA] mb-4">Eng ko'p buyurtma qilingan taomlar</h3>
          {chartsLoading ? (
            <div className="space-y-3">
              {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-8 w-full" />)}
            </div>
          ) : topMenus.length === 0 ? (
            <p className="text-[#A1A1AA] text-sm text-center py-8">Ma'lumot yo'q</p>
          ) : (
            <div className="space-y-3">
              {topMenus.map((item, i) => {
                const medals = ['🥇', '🥈', '🥉'];
                const maxCount = topMenus[0]?.count ?? 1;
                const pct = Math.round((item.count / maxCount) * 100);
                return (
                  <div key={item.name} className="flex items-center gap-3">
                    <span className="text-base w-6 shrink-0">{medals[i] ?? `${i + 1}.`}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-[#FAFAFA] truncate">{item.name}</span>
                        <span className="text-xs text-[#A1A1AA] ml-2 shrink-0">{item.count} marta</span>
                      </div>
                      <div className="h-1.5 bg-[#2A2A2A] rounded-full overflow-hidden">
                        <div className="h-full bg-[#F59E0B] rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent orders */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-card p-5">
          <h3 className="text-sm font-semibold text-[#FAFAFA] mb-4">Oxirgi buyurtmalar</h3>
          {chartsLoading ? (
            <div className="space-y-2">
              {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : recentOrders.length === 0 ? (
            <p className="text-[#A1A1AA] text-sm text-center py-8">Buyurtmalar yo'q</p>
          ) : (
            <div className="space-y-2">
              {recentOrders.slice(0, 8).map(order => {
                const mins = Math.round((Date.now() - new Date(order.created_at).getTime()) / 60000);
                const tableNum = (order.table as { table_number?: number } | undefined)?.table_number ?? '?';
                const itemCount = order.order_items?.length ?? 0;
                return (
                  <div key={order.id} className="flex items-center gap-3 py-2 border-b border-[#2A2A2A]/50 last:border-0">
                    <div className="w-8 h-8 bg-[#2A2A2A] rounded-btn flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-[#FAFAFA]">{tableNum}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#A1A1AA]">{itemCount} ta taom</span>
                        <span className="text-xs font-medium text-[#FAFAFA]">{formatPrice(order.total_amount)}</span>
                      </div>
                    </div>
                    <StatusBadge status={order.status} />
                    <span className="text-xs text-[#A1A1AA] shrink-0">{mins} min</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
