import React, { useState, useCallback } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, RefreshCw } from 'lucide-react';
import { useOrders } from '../../hooks/useOrders';
import { useRealtimeOrders } from '../../hooks/useRealtime';
import { useToast } from '../../lib/toast';
import { Order, OrderStatus, formatPrice } from '../../lib/types';
import { useAuthStore } from '../../store/authStore';
import StatusBadge from '../../components/UI/StatusBadge';
import { TableSkeleton } from '../../components/UI/LoadingSkeleton';

const STATUS_TABS: { key: OrderStatus | 'all'; label: string }[] = [
  { key: 'all',       label: 'Hammasi' },
  { key: 'pending',   label: 'Kutilmoqda' },
  { key: 'cooking',   label: 'Tayyorlanmoqda' },
  { key: 'ready',     label: 'Tayyor' },
  { key: 'completed', label: 'Tugallangan' },
  { key: 'cancelled', label: 'Bekor qilingan' },
];

const STATUS_NEXT: Partial<Record<OrderStatus, OrderStatus>> = {
  pending:   'cooking',
  cooking:   'ready',
  ready:     'completed',
};

const OrdersPage: React.FC = () => {
  const { organization } = useAuthStore();
  const orgId = organization?.id;
  const { success, error: toastError } = useToast();

  const [activeStatus, setActiveStatus] = useState<OrderStatus | 'all'>('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const { orders, loading, refetch } = useOrders({ status: activeStatus, date: selectedDate });

  // Realtime
  const handleInsert = useCallback((order: Order) => {
    success(`Yangi buyurtma! ${(order.table as { table_number?: number } | undefined)?.table_number ?? ''}-stol`);
    refetch();
  }, [success, refetch]);

  const handleUpdate = useCallback(() => { refetch(); }, [refetch]);

  useRealtimeOrders({ onInsert: handleInsert, onUpdate: handleUpdate });

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock update
    success('Status yangilandi');
    refetch();
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }
    setUpdatingId(null);
  };

  const formatTime = (iso: string) => {
    const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    if (mins < 60) return `${mins} min`;
    return `${Math.floor(mins / 60)}s ${mins % 60}m`;
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status tabs */}
          <div className="flex flex-wrap gap-1.5">
            {STATUS_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveStatus(tab.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-btn transition-all ${
                  activeStatus === tab.key
                    ? 'bg-[#F59E0B] text-black'
                    : 'bg-[#2A2A2A] text-[#A1A1AA] hover:text-[#FAFAFA]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="bg-[#0F0F0F] border border-[#2A2A2A] rounded-input px-3 py-1.5 text-xs text-[#FAFAFA] focus:outline-none focus:border-[#F59E0B]/50"
            />
            <button onClick={refetch} className="p-1.5 text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors">
              <RefreshCw size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-card overflow-hidden">
        {loading ? (
          <div className="p-6"><TableSkeleton rows={6} cols={7} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2A2A2A]">
                  {['№', 'Stol', 'Ofitsiant', 'Taomlar', 'Summa', 'Holat', 'Vaqt', 'Harakatlar'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-medium text-[#A1A1AA] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={8} className="py-12 text-center text-[#A1A1AA] text-sm">Buyurtmalar topilmadi</td></tr>
                ) : orders.map((order, idx) => {
                  const tableNum = (order.table as { table_number?: number } | undefined)?.table_number ?? '?';
                  const waiterName = (order.waiter as { full_name?: string } | undefined)?.full_name ?? '—';
                  const itemCount = order.order_items?.length ?? 0;
                  const nextStatus = STATUS_NEXT[order.status];

                  return (
                    <tr key={order.id} className="border-b border-[#2A2A2A]/50 hover:bg-[#2A2A2A]/30 transition-colors">
                      <td className="py-3 px-4 text-xs text-[#A1A1AA]">{idx + 1}</td>
                      <td className="py-3 px-4">
                        <span className="w-7 h-7 bg-[#2A2A2A] rounded-btn inline-flex items-center justify-center text-xs font-bold text-[#FAFAFA]">
                          {tableNum}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-[#FAFAFA]">{waiterName}</td>
                      <td className="py-3 px-4 text-sm text-[#A1A1AA]">{itemCount} ta</td>
                      <td className="py-3 px-4 text-sm font-medium text-[#FAFAFA]">{formatPrice(order.total_amount)}</td>
                      <td className="py-3 px-4"><StatusBadge status={order.status} /></td>
                      <td className="py-3 px-4 text-xs text-[#A1A1AA]">{formatTime(order.created_at)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-xs text-[#F59E0B] hover:underline"
                          >
                            Ko'rish
                          </button>
                          {nextStatus && (
                            <button
                              onClick={() => updateStatus(order.id, nextStatus)}
                              disabled={updatingId === order.id}
                              className="text-xs bg-[#2A2A2A] hover:bg-[#3A3A3A] text-[#FAFAFA] px-2 py-1 rounded transition-colors disabled:opacity-50"
                            >
                              {updatingId === order.id ? '...' : '→'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <Dialog.Root open={!!selectedOrder} onOpenChange={open => !open && setSelectedOrder(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/70 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#1A1A1A] border border-[#2A2A2A] rounded-card p-6 z-50 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <Dialog.Title className="text-base font-semibold text-[#FAFAFA]">
                Buyurtma #{selectedOrder?.id?.slice(-6).toUpperCase()}
              </Dialog.Title>
              <Dialog.Close className="text-[#A1A1AA] hover:text-[#FAFAFA]">
                <X size={18} />
              </Dialog.Close>
            </div>

            {selectedOrder && (
              <div className="space-y-4">
                {/* Info */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-[#0F0F0F] rounded-btn p-3">
                    <p className="text-[#A1A1AA] text-xs mb-1">Stol</p>
                    <p className="text-[#FAFAFA] font-medium">
                      {(selectedOrder.table as { table_number?: number } | undefined)?.table_number ?? '?'}-stol
                    </p>
                  </div>
                  <div className="bg-[#0F0F0F] rounded-btn p-3">
                    <p className="text-[#A1A1AA] text-xs mb-1">Status</p>
                    <StatusBadge status={selectedOrder.status} />
                  </div>
                  <div className="bg-[#0F0F0F] rounded-btn p-3">
                    <p className="text-[#A1A1AA] text-xs mb-1">Jami summa</p>
                    <p className="text-[#F59E0B] font-semibold">{formatPrice(selectedOrder.total_amount)}</p>
                  </div>
                  <div className="bg-[#0F0F0F] rounded-btn p-3">
                    <p className="text-[#A1A1AA] text-xs mb-1">Vaqt</p>
                    <p className="text-[#FAFAFA] font-medium">
                      {new Date(selectedOrder.created_at).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <p className="text-xs font-medium text-[#A1A1AA] uppercase tracking-wider mb-2">Buyurtma tarkibi</p>
                  <div className="space-y-2">
                    {(selectedOrder.order_items ?? []).map(item => (
                      <div key={item.id} className="flex items-center justify-between py-2 border-b border-[#2A2A2A]/50 last:border-0">
                        <div>
                          <p className="text-sm text-[#FAFAFA]">{item.menu_name}</p>
                          {item.modifications && (
                            <p className="text-xs text-[#A1A1AA]">{item.modifications}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-[#FAFAFA]">x{item.quantity}</p>
                          <p className="text-xs text-[#A1A1AA]">{formatPrice(item.menu_price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Note */}
                {selectedOrder.customer_note && (
                  <div className="bg-[#0F0F0F] rounded-btn p-3">
                    <p className="text-xs text-[#A1A1AA] mb-1">Mijoz izohi</p>
                    <p className="text-sm text-[#FAFAFA]">{selectedOrder.customer_note}</p>
                  </div>
                )}

                {/* Status change */}
                {STATUS_NEXT[selectedOrder.status] && (
                  <button
                    onClick={() => updateStatus(selectedOrder.id, STATUS_NEXT[selectedOrder.status]!)}
                    disabled={updatingId === selectedOrder.id}
                    className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-black font-semibold py-2.5 rounded-btn transition-colors disabled:opacity-50"
                  >
                    {updatingId === selectedOrder.id ? 'Yangilanmoqda...' : `→ ${STATUS_TABS.find(t => t.key === STATUS_NEXT[selectedOrder.status])?.label}`}
                  </button>
                )}
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default OrdersPage;
