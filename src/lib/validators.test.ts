import { describe, it, expect } from 'vitest';
import { menuSchema, staffSchema, MENU_LIMITS } from './validators';

describe('menuSchema', () => {
  const valid = {
    name: 'Plov',
    category_id: 'cat-1',
    price_som: 25000,
    cook_time_minutes: 20,
    is_available: true,
  };

  it('accepts a well-formed menu item', () => {
    expect(menuSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects an empty name', () => {
    const res = menuSchema.safeParse({ ...valid, name: '' });
    expect(res.success).toBe(false);
  });

  it('rejects a name over the max length', () => {
    const res = menuSchema.safeParse({ ...valid, name: 'a'.repeat(MENU_LIMITS.nameMax + 1) });
    expect(res.success).toBe(false);
  });

  it('rejects a price below the minimum', () => {
    const res = menuSchema.safeParse({ ...valid, price_som: MENU_LIMITS.priceMin - 1 });
    expect(res.success).toBe(false);
  });

  it('requires a category', () => {
    const res = menuSchema.safeParse({ ...valid, category_id: '' });
    expect(res.success).toBe(false);
  });

  it('defaults cook time when omitted', () => {
    const { name, category_id, price_som, is_available } = valid;
    const res = menuSchema.safeParse({ name, category_id, price_som, is_available });
    expect(res.success).toBe(true);
    if (res.success) expect(res.data.cook_time_minutes).toBe(MENU_LIMITS.cookDefault);
  });
});

describe('staffSchema', () => {
  const valid = { full_name: 'Ali Valiyev', role: 'chef' as const, username: 'ali_07', password: 'secret1' };

  it('accepts well-formed staff', () => {
    expect(staffSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects an uppercase / non-slug username', () => {
    expect(staffSchema.safeParse({ ...valid, username: 'Ali Valiyev' }).success).toBe(false);
  });

  it('rejects a short password', () => {
    expect(staffSchema.safeParse({ ...valid, password: '123' }).success).toBe(false);
  });

  it('rejects a role outside the allowed set', () => {
    expect(staffSchema.safeParse({ ...valid, role: 'manager' }).success).toBe(false);
  });
});
