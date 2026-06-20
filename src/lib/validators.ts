// ─── Form validators ────────────────────────────────────────────────────────
//
// One home for form validation rules. Before, each page embedded its own Zod
// schema, so a rule change (a length limit, a regex) meant hunting across pages,
// and the rules couldn't be tested without mounting a component.
//
// Here the limits are named constants and the schemas are exported once; pages
// import them and stay thin. The schemas are the test surface — exercise them
// directly, no React required.

import { z } from 'zod';

// Shared limit constants — change a rule in exactly one place.
export const MENU_LIMITS = {
  nameMin: 2,
  nameMax: 100,
  descMax: 500,
  ingredientsMax: 500,
  priceMin: 100, // som
  priceMax: 10_000_000, // som
  cookMin: 1, // minutes
  cookMax: 300, // minutes
  cookDefault: 15,
} as const;

export const STAFF_LIMITS = {
  nameMin: 2,
  usernameMin: 3,
  passwordMin: 6,
} as const;

export const menuSchema = z.object({
  name: z
    .string()
    .min(1, 'Taom nomini kiriting')
    .min(MENU_LIMITS.nameMin, `Taom nomi kamida ${MENU_LIMITS.nameMin} ta belgidan iborat bo'lishi kerak`)
    .max(MENU_LIMITS.nameMax, `Taom nomi ${MENU_LIMITS.nameMax} ta belgidan oshmasligi kerak`),
  category_id: z.string().min(1, 'Kategoriyani tanlang'),
  price_som: z
    .number({ invalid_type_error: 'Narxni kiriting' })
    .min(MENU_LIMITS.priceMin, `Narx kamida ${MENU_LIMITS.priceMin} so'm bo'lishi kerak`)
    .max(MENU_LIMITS.priceMax, `Narx 10,000,000 so'mdan oshmasligi kerak`),
  description: z.string().max(MENU_LIMITS.descMax, `Tavsif ${MENU_LIMITS.descMax} ta belgidan oshmasligi kerak`).optional(),
  ingredients: z.string().max(MENU_LIMITS.ingredientsMax, `Tarkib ${MENU_LIMITS.ingredientsMax} ta belgidan oshmasligi kerak`).optional(),
  cook_time_minutes: z
    .number()
    .min(MENU_LIMITS.cookMin, `Pishirish vaqti kamida ${MENU_LIMITS.cookMin} daqiqa bo'lishi kerak`)
    .max(MENU_LIMITS.cookMax, `Pishirish vaqti ${MENU_LIMITS.cookMax} daqiqadan oshmasligi kerak`)
    .default(MENU_LIMITS.cookDefault),
  is_available: z.boolean().default(true),
  sort_order: z.number().optional(),
});

export type MenuFormData = z.infer<typeof menuSchema>;

export const staffSchema = z.object({
  full_name: z.string().min(STAFF_LIMITS.nameMin, `Ism kamida ${STAFF_LIMITS.nameMin} ta belgidan iborat bo'lishi kerak`),
  role: z.enum(['chef', 'waiter']),
  username: z
    .string()
    .min(STAFF_LIMITS.usernameMin, `Login kamida ${STAFF_LIMITS.usernameMin} ta belgidan iborat bo'lishi kerak`)
    .regex(/^[a-z0-9_]+$/, 'Faqat kichik harflar, raqamlar va _ belgisidan foydalaning'),
  password: z.string().min(STAFF_LIMITS.passwordMin, `Parol kamida ${STAFF_LIMITS.passwordMin} ta belgidan iborat bo'lishi kerak`),
});

export type StaffFormData = z.infer<typeof staffSchema>;
