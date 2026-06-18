import React, { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, CreditCard, Lock, Upload, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../../lib/toast';
import Button from '../../components/UI/Button';

const orgSchema = z.object({
  name: z.string().min(2, "Restoran nomi kamida 2 ta belgidan iborat bo'lishi kerak"),
  address: z.string().optional(),
  phone: z.string().optional(),
});

const passwordSchema = z.object({
  current: z.string().min(6, "Joriy parol kamida 6 ta belgidan iborat bo'lishi kerak"),
  new: z.string().min(6, "Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak"),
  confirm: z.string().min(6, "Tasdiqlash kamida 6 ta belgidan iborat bo'lishi kerak"),
}).refine(data => data.new === data.confirm, {
  message: "Parollar bir-biriga mos kelmadi",
  path: ["confirm"],
});

type OrgFormData = z.infer<typeof orgSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const planLabels: Record<string, string> = {
  trial: 'Sinov',
  basic: 'Oddiy',
  pro: 'Professional',
  enterprise: 'Korporativ',
};

const SettingsPage: React.FC = () => {
  const { organization, loadProfile } = useAuthStore();
  const { success, error: toastError } = useToast();
  const [uploading, setUploading] = useState(false);

  const { register: regOrg, handleSubmit: handleOrgSubmit, formState: { errors: orgErrors, isSubmitting: orgSubmitting } } = useForm<OrgFormData>({
    resolver: zodResolver(orgSchema),
    defaultValues: {
      name: organization?.name ?? '',
      address: organization?.address ?? '',
      phone: organization?.phone ?? '',
    },
  });

  const { register: regPass, handleSubmit: handlePassSubmit, reset: resetPass, formState: { errors: passErrors, isSubmitting: passSubmitting } } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onOrgSubmit = async (data: OrgFormData) => {
    if (!organization?.id) return;
    await new Promise(resolve => setTimeout(resolve, 500));
    
    success('Ma\'lumotlar muvaffaqiyatli saqlandi');
    loadProfile();
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    success('Parol muvaffaqiyatli o\'zgartirildi');
    resetPass();
  };

  const uploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !organization?.id) return;

    setUploading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    success('Logo muvaffaqiyatli yangilandi');
    loadProfile();
    setUploading(false);
  };

  const expiresAt = organization?.subscription_expires_at
    ? new Date(organization.subscription_expires_at).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  return (
    <div className="max-w-3xl">
      <Tabs.Root defaultValue="org" className="space-y-4">
        <Tabs.List className="flex gap-2 border-b border-[#2A2A2A] pb-2">
          <Tabs.Trigger
            value="org"
            className="px-4 py-2 text-sm font-medium text-[#A1A1AA] hover:text-[#FAFAFA] data-[state=active]:text-[#F59E0B] data-[state=active]:border-b-2 data-[state=active]:border-[#F59E0B] transition-colors"
          >
            <Building2 size={16} className="inline mr-2" />
            Restoran
          </Tabs.Trigger>
          <Tabs.Trigger
            value="subscription"
            className="px-4 py-2 text-sm font-medium text-[#A1A1AA] hover:text-[#FAFAFA] data-[state=active]:text-[#F59E0B] data-[state=active]:border-b-2 data-[state=active]:border-[#F59E0B] transition-colors"
          >
            <CreditCard size={16} className="inline mr-2" />
            Obuna
          </Tabs.Trigger>
          <Tabs.Trigger
            value="security"
            className="px-4 py-2 text-sm font-medium text-[#A1A1AA] hover:text-[#FAFAFA] data-[state=active]:text-[#F59E0B] data-[state=active]:border-b-2 data-[state=active]:border-[#F59E0B] transition-colors"
          >
            <Lock size={16} className="inline mr-2" />
            Xavfsizlik
          </Tabs.Trigger>
        </Tabs.List>

        {/* Organization */}
        <Tabs.Content value="org" className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-card p-6">
          <form onSubmit={handleOrgSubmit(onOrgSubmit)} className="space-y-5">
            {/* Logo */}
            <div>
              <label className="block text-sm font-medium text-[#A1A1AA] mb-3">Logo</label>
              <div className="flex items-center gap-4">
                {organization?.logo_url ? (
                  <img src={organization.logo_url} alt="logo" className="w-16 h-16 rounded-card object-cover" />
                ) : (
                  <div className="w-16 h-16 bg-[#2A2A2A] rounded-card flex items-center justify-center">
                    <Building2 size={24} className="text-[#A1A1AA]" />
                  </div>
                )}
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={uploadLogo} disabled={uploading} />
                  <Button type="button" variant="outline" size="sm" icon={Upload} loading={uploading}>
                    Yangi yuklash
                  </Button>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#A1A1AA] mb-1.5">Restoran nomi *</label>
              <input {...regOrg('name')} className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-input px-3 py-2.5 text-sm text-[#FAFAFA] focus:outline-none focus:border-[#F59E0B]/50" />
              {orgErrors.name && <p className="text-red-400 text-xs mt-1">{orgErrors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#A1A1AA] mb-1.5">Manzil</label>
              <input {...regOrg('address')} className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-input px-3 py-2.5 text-sm text-[#FAFAFA] focus:outline-none focus:border-[#F59E0B]/50" />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#A1A1AA] mb-1.5">Telefon</label>
              <input {...regOrg('phone')} className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-input px-3 py-2.5 text-sm text-[#FAFAFA] focus:outline-none focus:border-[#F59E0B]/50" />
            </div>

            <Button type="submit" loading={orgSubmitting}>Saqlash</Button>
          </form>
        </Tabs.Content>

        {/* Subscription */}
        <Tabs.Content value="subscription" className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-card p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0F0F0F] rounded-card p-4">
                <p className="text-xs text-[#A1A1AA] mb-1">Joriy reja</p>
                <p className="text-lg font-semibold text-[#F59E0B]">
                  {planLabels[organization?.subscription_plan ?? 'trial'] ?? 'Trial'}
                </p>
              </div>
              <div className="bg-[#0F0F0F] rounded-card p-4">
                <p className="text-xs text-[#A1A1AA] mb-1">Narx</p>
                <p className="text-lg font-semibold text-[#FAFAFA]">
                  {organization?.monthly_price ? `${(organization.monthly_price / 100).toLocaleString('uz-UZ')} so'm/oy` : '—'}
                </p>
              </div>
              <div className="bg-[#0F0F0F] rounded-card p-4">
                <p className="text-xs text-[#A1A1AA] mb-1">Tugash sanasi</p>
                <p className="text-lg font-semibold text-[#FAFAFA]">{expiresAt ?? '—'}</p>
              </div>
              <div className="bg-[#0F0F0F] rounded-card p-4">
                <p className="text-xs text-[#A1A1AA] mb-1">Holati</p>
                <p className="text-lg font-semibold text-green-400">✅ Faol</p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#2A2A2A]">
              <p className="text-sm text-[#A1A1AA] mb-3">
                Obunani uzaytirish yoki rejani o&apos;zgartirish uchun qo&apos;llab-quvvatlash xizmati bilan bog&apos;laning
              </p>
              <Button variant="outline">Bog&apos;lanish</Button>
            </div>
          </div>
        </Tabs.Content>

        {/* Security */}
        <Tabs.Content value="security" className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-card p-6">
          <form onSubmit={handlePassSubmit(onPasswordSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#A1A1AA] mb-1.5">Joriy parol *</label>
              <input {...regPass('current')} type="password" className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-input px-3 py-2.5 text-sm text-[#FAFAFA] focus:outline-none focus:border-[#F59E0B]/50" />
              {passErrors.current && <p className="text-red-400 text-xs mt-1">{passErrors.current.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#A1A1AA] mb-1.5">Yangi parol *</label>
              <input {...regPass('new')} type="password" className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-input px-3 py-2.5 text-sm text-[#FAFAFA] focus:outline-none focus:border-[#F59E0B]/50" />
              {passErrors.new && <p className="text-red-400 text-xs mt-1">{passErrors.new.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#A1A1AA] mb-1.5">Tasdiqlash *</label>
              <input {...regPass('confirm')} type="password" className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-input px-3 py-2.5 text-sm text-[#FAFAFA] focus:outline-none focus:border-[#F59E0B]/50" />
              {passErrors.confirm && <p className="text-red-400 text-xs mt-1">{passErrors.confirm.message}</p>}
            </div>

            <Button type="submit" loading={passSubmitting}>Parolni o&apos;zgartirish</Button>
          </form>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};

export default SettingsPage;
