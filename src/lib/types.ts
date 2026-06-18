// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = 'super_admin' | 'manager' | 'chef' | 'waiter';
export type SubscriptionPlan = 'trial' | 'basic' | 'pro' | 'enterprise';
export type OrderStatus = 'pending' | 'cooking' | 'ready' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Organization {
  id: string;
  name?: string;
  full_name?: string;
  logo_url?: string | null;
  address?: string | null;
  phone?: string | null;
  subscription_plan?: SubscriptionPlan;
  subscription_status?: string;
  subscription_expires_at?: string | null;
  trial_ends_at?: string | null;
  monthly_price?: number;
  role?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile {
  id: string;
  organization_id?: string;
  full_name?: string;
  role: UserRole;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  pin_code?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  organization_id?: string;
  organization?: string;
  name: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
  items_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Menu {
  id: string;
  organization_id: string;
  category_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  price: number; // tiyin
  cook_time_minutes: number;
  ingredients: string | null;
  is_available: boolean;
  sort_order: number;
  category?: Category;
}

export interface Table {
  id: string;
  organization_id?: string;
  table_number: number;
  qr_code_id?: string; // Optional, may not be returned by backend
  assigned_waiter_id?: string | null;
  waiter_name?: string | null;
  is_active: boolean;
  assigned_waiter?: UserProfile;
  orders?: Order[];
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: string;
  organization_id: string;
  table_id: string;
  waiter_id: string | null;
  status: OrderStatus;
  total_amount: number; // tiyin
  tip_amount: number;
  tip_percentage: number;
  customer_note: string | null;
  created_at: string;
  completed_at: string | null;
  table?: Table;
  waiter?: UserProfile;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_id: string;
  menu_name: string;
  menu_price: number; // tiyin
  quantity: number;
  modifications: string | null;
  item_status: string;
}

export interface Payment {
  id: string;
  organization_id: string;
  order_id: string;
  amount: number;
  payment_method: string;
  payment_status: PaymentStatus;
  transaction_id: string | null;
}

export interface Notification {
  id: string;
  organization_id: string;
  recipient_id: string;
  type: string;
  message: string;
  order_id: string | null;
  is_read: boolean;
  created_at: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Tiyinni so'mga o'girish va formatlash */
export function formatPrice(tiyin: number): string {
  return (tiyin / 100).toLocaleString('uz-UZ') + " so'm";
}

/** So'mni tiyinga o'girish (saqlash uchun) */
export function toTiyin(som: number): number {
  return Math.round(som * 100);
}

/** Rasm URL'ini to'g'ri formatlash */
export function getImageUrl(imageUrl: string | null | undefined): string | null {
  if (!imageUrl) return null;
  
  // Agar to'liq URL bo'lsa, o'zini qaytarish
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Agar nisbiy yo'l bo'lsa, backend URL bilan birlashtirish
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  
  // Agar baseUrl bo'sh bo'lsa (proxy ishlatilayotgan bo'lsa)
  if (!baseUrl) {
    // Proxy orqali
    return imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  }
  
  // To'liq URL yaratish
  return imageUrl.startsWith('/') ? `${baseUrl}${imageUrl}` : `${baseUrl}/${imageUrl}`;
}
