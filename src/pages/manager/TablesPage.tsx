import React, { useState, useEffect, useCallback } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Plus, QrCode, Pencil, Trash2, X, Download, Printer } from 'lucide-react';
import QRCode from 'qrcode';
import { Table, formatPrice } from '../../lib/types';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../../lib/toast';
import { TableSkeleton } from '../../components/UI/LoadingSkeleton';
import Button from '../../components/UI/Button';
import { tableService } from '../../lib/tableService';
import { staffService } from '../../lib/staffService';

const QR_BASE_URL = 'https://dastyormenu-client.vercel.app';

const TablesPage: React.FC = () => {
  const { organization } = useAuthStore();
  const orgId = organization?.id ?? '';
  const { success, error: toastError } = useToast();

  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrModal, setQrModal] = useState<Table | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [addCount, setAddCount] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [adding, setAdding] = useState(false);

  const fetchTables = useCallback(async () => {
    if (!orgId) return;
    setLoading(true);
    
    try {
      console.log('🔵 Fetching tables and staff...');
      
      const [tablesResponse, staffResponse] = await Promise.all([
        tableService.getTables(),
        staffService.getStaff(),
      ]);

      if (tablesResponse.success && staffResponse.success) {
        const tablesData = tablesResponse.data || [];
        const staffData = staffResponse.data || [];
        
        // Add waiter info to tables
        const tablesWithWaiter = tablesData.map(t => ({
          ...t,
          assigned_waiter: staffData.find(u => u.id === t.assigned_waiter_id),
          orders: [],
        }));
        
        console.log('✅ Fetched:', tablesData.length, 'tables,', staffData.length, 'staff');
        setTables(tablesWithWaiter);
      } else {
        const errorMsg = tablesResponse.error?.message || staffResponse.error?.message || 'Ma\'lumotlar yuklanmadi';
        console.error('❌ Fetch error:', errorMsg);
        toastError(errorMsg);
      }
    } catch (error) {
      console.error('❌ Fetch exception:', error);
      toastError('Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  }, [orgId, toastError]);

  useEffect(() => { fetchTables(); }, [fetchTables]);

  // Generate QR
  useEffect(() => {
    if (!qrModal) return;
    // Use table ID for QR code URL (backend doesn't return qr_code_id)
    const url = `${QR_BASE_URL}/${qrModal.id}`;
    QRCode.toDataURL(url, { width: 300, margin: 2, color: { dark: '#000000', light: '#FFFFFF' } })
      .then(setQrDataUrl);
  }, [qrModal]);

  const downloadQR = () => {
    if (!qrDataUrl || !qrModal) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `stol-${qrModal.table_number}-qr.png`;
    a.click();
  };

  const printQR = () => {
    if (!qrDataUrl || !qrModal) return;
    const win = window.open('', '_blank');
    if (!win) return;
    const orgName = organization?.full_name || organization?.name || 'Dastyor Menu';
    const qrUrl = `${QR_BASE_URL}/${qrModal.id}`;
    
    win.document.write(`
      <html><head><title>Stol ${qrModal.table_number} QR</title></head>
      <body style="display:flex;flex-direction:column;align-items:center;padding:20px;font-family:sans-serif">
        <h2>${orgName}</h2>
        <p style="font-size:18px;font-weight:bold">${qrModal.table_number}-stol</p>
        <img src="${qrDataUrl}" style="width:250px;height:250px" />
        <p style="font-size:12px;color:#666;margin-top:8px">Menyu uchun QR kodni skanlang</p>
        <p style="font-size:10px;color:#999;margin-top:4px">${qrUrl}</p>
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  const addTables = async () => {
    if (!orgId || addCount < 1) return;
    setAdding(true);
    
    try {
      console.log('🔵 Adding', addCount, 'tables...');
      
      // Get the highest table number
      const maxTableNumber = tables.length > 0 
        ? Math.max(...tables.map(t => t.table_number))
        : 0;
      
      // Create tables sequentially
      const promises = [];
      for (let i = 1; i <= addCount; i++) {
        promises.push(
          tableService.createTable({
            organization: orgId,
            table_number: maxTableNumber + i,
            is_active: true,
          })
        );
      }
      
      const results = await Promise.all(promises);
      const successCount = results.filter(r => r.success).length;
      
      if (successCount > 0) {
        console.log('✅ Created', successCount, 'tables');
        success(`${successCount} ta stol muvaffaqiyatli qo'shildi`);
        fetchTables();
        setShowAddModal(false);
      } else {
        console.error('❌ No tables created');
        toastError('Stollar qo\'shilmadi');
      }
    } catch (error) {
      console.error('❌ Add tables error:', error);
      toastError('Xatolik yuz berdi');
    } finally {
      setAdding(false);
    }
  };

  const deleteTable = async (id: string) => {
    if (!confirm('Stolni butunlay o\'chirib tashlashni xohlaysizmi?')) return;
    
    try {
      console.log('🔵 Deleting table:', id);
      
      const response = await tableService.deleteTable(id);
      
      if (response.success) {
        console.log('✅ Table deleted');
        success('Stol muvaffaqiyatli o\'chirildi');
        fetchTables();
      } else {
        console.error('❌ Delete failed:', response.error);
        toastError(response.error?.message || 'Stol o\'chirilmadi');
      }
    } catch (error) {
      console.error('❌ Delete exception:', error);
      toastError('Xatolik yuz berdi');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button icon={Plus} onClick={() => setShowAddModal(true)}>Yangi stol qo&apos;shish</Button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-card p-4 animate-pulse h-48" />
          ))}
        </div>
      ) : tables.length === 0 ? (
        <div className="text-center py-16 text-[#A1A1AA]">
          <p className="text-4xl mb-3">🪑</p>
          <p className="text-sm">Stollar topilmadi</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {tables.map(table => {
            const activeOrders = (table.orders ?? []).filter(
              (o: { status: string }) => ['pending', 'cooking', 'ready'].includes(o.status)
            ).length;
            const waiterName = (table.assigned_waiter as { full_name?: string } | undefined)?.full_name;

            return (
              <div key={table.id} className={`bg-[#1A1A1A] border rounded-card p-4 flex flex-col gap-3 transition-colors ${activeOrders > 0 ? 'border-[#F59E0B]/40' : 'border-[#2A2A2A]'}`}>
                {/* Table number */}
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-card flex items-center justify-center ${activeOrders > 0 ? 'bg-[#F59E0B]/20' : 'bg-[#2A2A2A]'}`}>
                    <span className={`text-xl font-bold ${activeOrders > 0 ? 'text-[#F59E0B]' : 'text-[#FAFAFA]'}`}>
                      {table.table_number}
                    </span>
                  </div>
                  {activeOrders > 0 && (
                    <span className="text-xs bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30 px-2 py-0.5 rounded-full">
                      {activeOrders} faol
                    </span>
                  )}
                </div>

                {/* Waiter */}
                <div>
                  <p className="text-xs text-[#A1A1AA]">Mas'ul ofitsiant</p>
                  <p className="text-sm text-[#FAFAFA]">{waiterName ?? 'Tayinlanmagan'}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => setQrModal(table)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20 text-[#F59E0B] rounded-btn transition-colors"
                  >
                    <QrCode size={13} /> QR
                  </button>
                  <button
                    onClick={() => deleteTable(table.id)}
                    className="p-1.5 text-[#A1A1AA] hover:text-red-400 bg-[#2A2A2A] hover:bg-red-500/10 rounded-btn transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QR Modal */}
      <Dialog.Root open={!!qrModal} onOpenChange={open => !open && setQrModal(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/70 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-[#1A1A1A] border border-[#2A2A2A] rounded-card p-6 z-50">
            <div className="flex items-center justify-between mb-5">
              <Dialog.Title className="text-base font-semibold text-[#FAFAFA]">
                {qrModal?.table_number}-stol QR kodi
              </Dialog.Title>
              <Dialog.Close className="text-[#A1A1AA] hover:text-[#FAFAFA]"><X size={18} /></Dialog.Close>
            </div>

            <div className="flex flex-col items-center gap-4">
              {qrDataUrl ? (
                <div className="bg-white p-4 rounded-card">
                  <img src={qrDataUrl} alt="QR" className="w-56 h-56" />
                </div>
              ) : (
                <div className="w-64 h-64 bg-[#0F0F0F] rounded-card animate-pulse" />
              )}

              <p className="text-xs text-[#A1A1AA] text-center break-all">
                {QR_BASE_URL}/{qrModal?.id}
              </p>

              <div className="flex gap-3 w-full">
                <Button variant="outline" icon={Download} fullWidth onClick={downloadQR}>Yuklab olish</Button>
                <Button variant="secondary" icon={Printer} fullWidth onClick={printQR}>Chop etish</Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Add tables modal */}
      <Dialog.Root open={showAddModal} onOpenChange={v => !v && setShowAddModal(false)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/70 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-[#1A1A1A] border border-[#2A2A2A] rounded-card p-6 z-50">
            <div className="flex items-center justify-between mb-5">
              <Dialog.Title className="text-base font-semibold text-[#FAFAFA]">Stol qo'shish</Dialog.Title>
              <Dialog.Close className="text-[#A1A1AA] hover:text-[#FAFAFA]"><X size={18} /></Dialog.Close>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">Nechta stol qo&apos;shmoqchisiz?</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={addCount}
                  onChange={e => setAddCount(Number(e.target.value))}
                  className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-input px-3 py-2 text-sm text-[#FAFAFA] focus:outline-none focus:border-[#F59E0B]/50"
                />
                <p className="text-xs text-[#A1A1AA] mt-1">
                  Stol raqamlari {tables.length > 0 ? tables[tables.length - 1]?.table_number + 1 : 1} dan boshlanadi
                </p>
              </div>

              <div className="flex gap-3">
                <Dialog.Close asChild>
                  <Button variant="outline" fullWidth>Bekor qilish</Button>
                </Dialog.Close>
                <Button fullWidth loading={adding} onClick={addTables}>Stollarni qo&apos;shish</Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default TablesPage;
