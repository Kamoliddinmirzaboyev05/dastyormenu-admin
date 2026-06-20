import React, { useState, useEffect, useCallback } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { staffSchema, type StaffFormData } from '../../lib/validators';
import { Plus, Eye, EyeOff, Copy, RefreshCw, Trash2, X } from 'lucide-react';
import { UserProfile } from '../../lib/types';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../../lib/toast';
import { TableSkeleton } from '../../components/UI/LoadingSkeleton';
import Button from '../../components/UI/Button';
import { staffService } from '../../lib/staffService';

// staffSchema + StaffFormData now live in src/lib/validators.ts

const generatePassword = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const roleLabels: Record<string, string> = {
  chef: 'Oshpaz',
  waiter: 'Ofitsiant',
};

const PasswordCell: React.FC<{ password: string }> = ({ password }) => {
  const [visible, setVisible] = useState(false);
  const { success } = useToast();

  const copy = () => {
    navigator.clipboard.writeText(password);
    success('Parol nusxalandi');
  };

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-sm text-[#FAFAFA]">{visible ? password : '••••••••'}</span>
      <button onClick={() => setVisible(v => !v)} className="text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors">
        {visible ? <EyeOff size={13} /> : <Eye size={13} />}
      </button>
      <button onClick={copy} className="text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors">
        <Copy size={13} />
      </button>
    </div>
  );
};

const StaffFormModal: React.FC<{
  open: boolean;
  onClose: () => void;
  orgId: string;
  onRefetch: () => void;
}> = ({ open, onClose, orgId, onRefetch }) => {
  const { success, error: toastError } = useToast();

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: { role: 'waiter', username: '', password: generatePassword() },
  });

  const password = watch('password');

  const onSubmit = async (data: StaffFormData) => {
    if (!orgId) {
      toastError('Organization ID topilmadi');
      return;
    }

    try {
      console.log('🔵 Creating staff:', data);
      
      const response = await staffService.createStaff({
        organization: orgId,
        username: data.username,
        password: data.password,
        full_name: data.full_name,
        role: data.role,
        pin_code: data.password, // Use password as pin_code
        is_active: true,
      });

      if (response.success) {
        console.log('✅ Staff created:', response.data);
        success('Xodim muvaffaqiyatli qo\'shildi');
        onRefetch();
        onClose();
      } else {
        console.error('❌ Staff creation failed:', response.error);
        toastError(response.error?.message || 'Xodim qo\'shilmadi');
      }
    } catch (error) {
      console.error('❌ Staff creation error:', error);
      toastError('Xatolik yuz berdi');
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={v => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#1A1A1A] border border-[#2A2A2A] rounded-card p-6 z-50">
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-base font-semibold text-[#FAFAFA]">Yangi xodim qo&apos;shish</Dialog.Title>
            <Dialog.Close className="text-[#A1A1AA] hover:text-[#FAFAFA]"><X size={18} /></Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">To&apos;liq ismi *</label>
              <input {...register('full_name')} className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-input px-3 py-2 text-sm text-[#FAFAFA] focus:outline-none focus:border-[#F59E0B]/50" />
              {errors.full_name && <p className="text-red-400 text-xs mt-1">{errors.full_name.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">Roli *</label>
              <select {...register('role')} className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-input px-3 py-2 text-sm text-[#FAFAFA] focus:outline-none focus:border-[#F59E0B]/50">
                <option value="waiter">Ofitsiant</option>
                <option value="chef">Oshpaz</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">Login (username) *</label>
              <input
                {...register('username')}
                placeholder="masalan: ali_chef"
                className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-input px-3 py-2 text-sm text-[#FAFAFA] font-mono focus:outline-none focus:border-[#F59E0B]/50"
              />
              {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>}
              <p className="text-xs text-[#A1A1AA] mt-1">Faqat kichik harflar, raqamlar va _ belgisi</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">Parol *</label>
              <div className="flex gap-2">
                <input
                  {...register('password')}
                  type="text"
                  className="flex-1 bg-[#0F0F0F] border border-[#2A2A2A] rounded-input px-3 py-2 text-sm text-[#FAFAFA] font-mono focus:outline-none focus:border-[#F59E0B]/50"
                />
                <button
                  type="button"
                  onClick={() => setValue('password', generatePassword())}
                  className="px-3 py-2 bg-[#2A2A2A] hover:bg-[#3A3A3A] text-[#A1A1AA] hover:text-[#FAFAFA] rounded-btn transition-colors"
                  title="Avtomatik yaratish"
                >
                  <RefreshCw size={15} />
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
              <p className="text-xs text-[#A1A1AA] mt-1">Kamida 6 ta belgi</p>
            </div>

            <div className="flex gap-3 pt-2">
              <Dialog.Close asChild>
                <Button variant="outline" fullWidth type="button">Bekor qilish</Button>
              </Dialog.Close>
              <Button type="submit" fullWidth loading={isSubmitting}>Xodim qo&apos;shish</Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const StaffPage: React.FC = () => {
  const { organization } = useAuthStore();
  const orgId = organization?.id ?? '';
  const { success, error: toastError } = useToast();

  const [staff, setStaff] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchStaff = useCallback(async () => {
    if (!orgId) return;
    setLoading(true);
    
    try {
      console.log('🔵 Fetching staff...');
      
      const response = await staffService.getStaff();

      if (response.success) {
        const staffData = response.data || [];
        // Filter only chef and waiter roles
        const staffList = staffData.filter(u => ['chef', 'waiter'].includes(u.role));
        
        console.log('✅ Fetched:', staffList.length, 'staff members');
        setStaff(staffList);
      } else {
        console.error('❌ Fetch error:', response.error);
        toastError(response.error?.message || 'Ma\'lumotlar yuklanmadi');
      }
    } catch (error) {
      console.error('❌ Fetch exception:', error);
      toastError('Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  }, [orgId, toastError]);

  useEffect(() => { fetchStaff(); }, [fetchStaff]);

  const toggleActive = async (id: string, current: boolean) => {
    try {
      console.log('🔵 Toggling staff active:', id, 'from', current, 'to', !current);
      
      const response = await staffService.toggleActive(id, current);
      
      if (response.success) {
        console.log('✅ Staff active toggled');
        success(current ? 'Xodim nofaol holatga o\'tkazildi' : 'Xodim faol holatga o\'tkazildi');
        setStaff(prev => prev.map(s => s.id === id ? { ...s, is_active: !current } : s));
      } else {
        console.error('❌ Toggle failed:', response.error);
        toastError(response.error?.message || 'Xatolik yuz berdi');
      }
    } catch (error) {
      console.error('❌ Toggle exception:', error);
      toastError('Xatolik yuz berdi');
    }
  };

  const deleteStaff = async (id: string) => {
    if (!confirm('Xodimni butunlay o\'chirib tashlashni xohlaysizmi?')) return;
    
    try {
      console.log('🔵 Deleting staff:', id);
      
      const response = await staffService.deleteStaff(id);
      
      if (response.success) {
        console.log('✅ Staff deleted');
        success('Xodim muvaffaqiyatli o\'chirildi');
        setStaff(prev => prev.filter(s => s.id !== id));
      } else {
        console.error('❌ Delete failed:', response.error);
        toastError(response.error?.message || 'Xodim o\'chirilmadi');
      }
    } catch (error) {
      console.error('❌ Delete exception:', error);
      toastError('Xatolik yuz berdi');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#A1A1AA]">Jami: {staff.length} ta xodim</p>
        <Button icon={Plus} onClick={() => setShowForm(true)}>Yangi xodim qo&apos;shish</Button>
      </div>

      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-card overflow-hidden">
        {loading ? (
          <div className="p-6"><TableSkeleton rows={5} cols={5} /></div>
        ) : staff.length === 0 ? (
          <div className="py-16 text-center text-[#A1A1AA]">
            <p className="text-4xl mb-3">👥</p>
            <p className="text-sm">Xodimlar topilmadi</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2A2A2A]">
                  {['To\'liq ismi', 'Lavozim', 'Login', 'Parol', 'Holat', 'Harakatlar'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-medium text-[#A1A1AA] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {staff.map(member => (
                  <tr key={member.id} className="border-b border-[#2A2A2A]/50 hover:bg-[#2A2A2A]/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#F59E0B]/20 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-[#F59E0B] text-xs font-bold">{member.full_name.charAt(0)}</span>
                        </div>
                        <span className="text-sm text-[#FAFAFA]">{member.full_name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${member.role === 'chef' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                        {roleLabels[member.role] ?? member.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-[#FAFAFA] font-mono">{member.username}</span>
                    </td>
                    <td className="py-3 px-4"><PasswordCell password={member.pin_code} /></td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleActive(member.id, member.is_active)}
                        className={`text-xs px-2 py-1 rounded-full transition-colors ${
                          member.is_active
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                        }`}
                      >
                        {member.is_active ? '✅ Faol' : '⏸ Nofaol'}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => deleteStaff(member.id)}
                        className="text-[#A1A1AA] hover:text-red-400 transition-colors p-1"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <StaffFormModal open={showForm} onClose={() => setShowForm(false)} orgId={orgId} onRefetch={fetchStaff} />
    </div>
  );
};

export default StaffPage;
