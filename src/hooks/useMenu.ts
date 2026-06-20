import { useMemo } from 'react';
import { Menu, Category } from '../lib/types';
import { useAuthStore } from '../store/authStore';
import { menuService } from '../lib/menuService';
import { categoryService } from '../lib/categoryService';
import { resizeImage, fileToBase64 } from '../lib/imageUploadService';
import { useQuery, useMutation } from './useQuery';

// Data fetching now goes through the shared query client: menus and categories
// are cached and de-duplicated by key, and writes invalidate the menu key so the
// list refetches from one place (no manual optimistic patching, no realtime race).
export function useMenu() {
  const { organization } = useAuthStore();
  const enabled = !!organization;

  const menusQuery = useQuery<Menu[]>({ key: 'menu', fetcher: () => menuService.getMenus(), enabled });
  const categoriesQuery = useQuery<Category[]>({ key: 'categories', fetcher: () => categoryService.getCategories(), enabled });

  const categories = categoriesQuery.data ?? [];

  // Attach the category object to each menu item (same shape as before).
  const menus = useMemo<Menu[]>(() => {
    const items = menusQuery.data ?? [];
    return items.map((menu) => ({
      ...menu,
      category: categories.find((c) => c.id === menu.category_id),
    }));
  }, [menusQuery.data, categories]);

  const refetch = () => {
    menusQuery.refetch();
    categoriesQuery.refetch();
  };

  const toggle = useMutation<{ id: string; current: boolean }, Menu>(
    ({ id, current }) => menuService.toggleAvailability(id, current),
    { invalidates: ['menu'] },
  );
  const remove = useMutation<string, void>((id) => menuService.deleteMenu(id), { invalidates: ['menu'] });

  const toggleAvailability = async (menuId: string, current: boolean): Promise<string | null> => {
    try {
      const res = await toggle.mutate({ id: menuId, current });
      return res.success ? null : res.error?.message ?? 'Xatolik yuz berdi';
    } catch (e) {
      return e instanceof Error ? e.message : 'Xatolik yuz berdi';
    }
  };

  const deleteMenu = async (menuId: string): Promise<string | null> => {
    try {
      const res = await remove.mutate(menuId);
      return res.success ? null : res.error?.message ?? 'Xatolik yuz berdi';
    } catch (e) {
      return e instanceof Error ? e.message : 'Xatolik yuz berdi';
    }
  };

  // Resize + base64 for in-form preview (unchanged).
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const resizedFile = await resizeImage(file, 800, 800, 0.85);
      return await fileToBase64(resizedFile);
    } catch {
      return null;
    }
  };

  return {
    menus,
    categories,
    loading: menusQuery.loading || categoriesQuery.loading,
    error: menusQuery.error || categoriesQuery.error,
    refetch,
    toggleAvailability,
    deleteMenu,
    uploadImage,
  };
}
