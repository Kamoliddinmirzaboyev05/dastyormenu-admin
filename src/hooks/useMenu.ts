import { useState, useEffect, useCallback } from 'react';
import { Menu, Category } from '../lib/types';
import { useAuthStore } from '../store/authStore';
import { menuService } from '../lib/menuService';
import { categoryService } from '../lib/categoryService';
import { resizeImage, fileToBase64 } from '../lib/imageUploadService';

export function useMenu() {
  const { organization } = useAuthStore();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    if (!organization) return;
    setLoading(true);
    setError(null);

    try {
      console.log('🔵 Fetching menus and categories...');
      
      const [menusResponse, categoriesResponse] = await Promise.all([
        menuService.getMenus(),
        categoryService.getCategories(),
      ]);

      if (menusResponse.success && categoriesResponse.success) {
        const menusData = menusResponse.data || [];
        const categoriesData = categoriesResponse.data || [];
        
        // Add category object to each menu and log image URLs
        const menusWithCategory = menusData.map(menu => {
          console.log('🖼️ Menu image:', menu.name, '→', menu.image_url);
          return {
            ...menu,
            category: categoriesData.find(c => c.id === menu.category_id),
          };
        });

        console.log('✅ Fetched:', menusData.length, 'menus,', categoriesData.length, 'categories');
        setMenus(menusWithCategory);
        setCategories(categoriesData);
      } else {
        const errorMsg = menusResponse.error?.message || categoriesResponse.error?.message || 'Ma\'lumotlar yuklanmadi';
        console.error('❌ Fetch error:', errorMsg);
        setError(errorMsg);
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'Xatolik yuz berdi';
      console.error('❌ Fetch exception:', e);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [organization]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const toggleAvailability = async (menuId: string, current: boolean): Promise<string | null> => {
    console.log('🔵 Toggling availability:', menuId, 'from', current, 'to', !current);
    
    try {
      const response = await menuService.toggleAvailability(menuId, current);
      
      if (response.success) {
        console.log('✅ Availability toggled');
        setMenus(prev => prev.map(m => m.id === menuId ? { ...m, is_available: !current } : m));
        return null;
      } else {
        console.error('❌ Toggle failed:', response.error);
        return response.error?.message || 'Xatolik yuz berdi';
      }
    } catch (e) {
      console.error('❌ Toggle exception:', e);
      return e instanceof Error ? e.message : 'Xatolik yuz berdi';
    }
  };

  const deleteMenu = async (menuId: string): Promise<string | null> => {
    console.log('🔵 Deleting menu:', menuId);
    
    try {
      const response = await menuService.deleteMenu(menuId);
      
      if (response.success) {
        console.log('✅ Menu deleted');
        setMenus(prev => prev.filter(m => m.id !== menuId));
        return null;
      } else {
        console.error('❌ Delete failed:', response.error);
        return response.error?.message || 'Xatolik yuz berdi';
      }
    } catch (e) {
      console.error('❌ Delete exception:', e);
      return e instanceof Error ? e.message : 'Xatolik yuz berdi';
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    console.log('🔵 Converting image to base64 for preview...');
    console.log('📸 Original file:', {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024).toFixed(2)} KB`,
    });
    
    try {
      // Rasmni kichraytirish (optimization)
      console.log('🔄 Resizing image...');
      const resizedFile = await resizeImage(file, 800, 800, 0.85);
      console.log('✅ Image resized:', {
        name: resizedFile.name,
        type: resizedFile.type,
        size: `${(resizedFile.size / 1024).toFixed(2)} KB`,
      });
      
      // Base64 ga o'girish (preview uchun)
      console.log('🔄 Converting to base64...');
      const base64 = await fileToBase64(resizedFile);
      console.log('✅ Image converted to base64 (preview ready)');
      console.log('📏 Base64 length:', base64.length, 'characters');
      
      return base64;
    } catch (error) {
      console.error('❌ Image conversion error:', error);
      return null;
    }
  };

  return { menus, categories, loading, error, refetch: fetchAll, toggleAvailability, deleteMenu, uploadImage };
}
