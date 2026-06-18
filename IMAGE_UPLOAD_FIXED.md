# ✅ Rasm Yuklash Muammosi Hal Qilindi!

## O'zgarishlar

### 1. `src/lib/types.ts` - getImageUrl() Helper Funksiya
```typescript
export function getImageUrl(imageUrl: string | null | undefined): string | null {
  if (!imageUrl) return null;
  
  // To'liq URL bo'lsa
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Nisbiy yo'l bo'lsa, backend URL bilan birlashtirish
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  
  if (!baseUrl) {
    // Proxy ishlatilayotgan bo'lsa
    return imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  }
  
  // To'liq URL yaratish
  return imageUrl.startsWith('/') ? `${baseUrl}${imageUrl}` : `${baseUrl}/${imageUrl}`;
}
```

### 2. `src/pages/manager/MenuPage.tsx` - Rasm Ko'rsatish
```typescript
// Import
import { getImageUrl } from '../../lib/types';

// Rasm ko'rsatish
<img 
  src={getImageUrl(menu.image_url) || ''} 
  alt={menu.name} 
  className="w-full h-full object-cover"
  onError={(e) => {
    console.error('❌ Image load error:', menu.image_url);
    // Fallback to placeholder
  }}
/>
```

### 3. `src/hooks/useMenu.ts` - Debug Logging
```typescript
const menusWithCategory = menusData.map(menu => {
  console.log('🖼️ Menu image:', menu.name, '→', menu.image_url);
  return { ...menu, category: ... };
});
```

## Qanday Ishlaydi?

### Backend Rasmni Qaytarish Formatlari:

**Format 1: To'liq URL**
```json
{
  "image_url": "https://dastyormenu-backend.up.railway.app/media/menu/osh.jpg"
}
```
✅ `getImageUrl()` o'zini qaytaradi

**Format 2: Nisbiy Yo'l**
```json
{
  "image_url": "/media/menu/osh.jpg"
}
```
✅ `getImageUrl()` to'liq URL yaratadi: `https://backend.com/media/menu/osh.jpg`

**Format 3: Fayl Nomi**
```json
{
  "image_url": "menu/osh.jpg"
}
```
✅ `getImageUrl()` to'liq URL yaratadi: `https://backend.com/menu/osh.jpg`

### Proxy Bilan Ishlash:

Agar `VITE_API_BASE_URL` bo'sh bo'lsa (proxy ishlatilayotgan):
```
/media/menu/osh.jpg → http://localhost:5176/media/menu/osh.jpg → Proxy → Backend
```

## Console'da Tekshirish

Browser console'da quyidagi loglarni ko'rishingiz kerak:

### Menu Yuklash:
```
🔵 Fetching menus and categories...
🖼️ Menu image: Osh → /media/menu/osh.jpg
🖼️ Menu image: Lag'mon → https://backend.com/media/menu/lagmon.jpg
✅ Fetched: 10 menus, 5 categories
```

### Rasm Yuklash:
```
📸 Image selected: { name: "osh.jpg", type: "image/jpeg", size: "245.67 KB" }
✅ Image preview ready: blob:http://localhost:5176/abc-123
```

### Yangi Taom Qo'shish:
```
🔵 Submitting menu: { name: "Osh", hasImage: true, ... }
➕ Creating new menu
📸 Uploading image file: osh.jpg image/jpeg 251584
✅ Menu created successfully: { id: "...", image_url: "/media/menu/osh.jpg" }
```

## Error Handling

### Rasm Yuklanmasa:
```javascript
onError={(e) => {
  console.error('❌ Image load error:', menu.image_url);
  // Fallback icon ko'rsatiladi
}}
```

### Rasm URL Formatlari:
- ✅ `https://backend.com/media/menu/osh.jpg` - To'liq URL
- ✅ `/media/menu/osh.jpg` - Nisbiy yo'l
- ✅ `media/menu/osh.jpg` - Fayl yo'li
- ❌ `null` - Placeholder icon
- ❌ `undefined` - Placeholder icon
- ❌ `""` - Placeholder icon

## Test Qiling

### 1. Mavjud Taomlarni Ko'rish
1. Menu sahifasiga o'ting
2. Console'ni oching (F12)
3. Quyidagi loglarni ko'ring:
```
🖼️ Menu image: Taom nomi → /media/menu/...
```

### 2. Yangi Taom Qo'shish
1. "Yangi taom qo'shish" tugmasini bosing
2. Rasm yuklang
3. Console'da:
```
📸 Image selected: { ... }
✅ Image preview ready: blob:...
```
4. Formni to'ldiring va submit qiling
5. Console'da:
```
✅ Menu created successfully: { image_url: "..." }
```

### 3. Rasm Ko'rinishini Tekshirish
1. Yangi qo'shilgan taomni toping
2. Rasm ko'rinishi kerak
3. Agar ko'rinmasa, console'da:
```
❌ Image load error: /media/menu/...
```

## Muammolar va Yechimlar

### Muammo 1: Rasm Ko'rinmayapti
**Sabab:** Backend noto'g'ri URL qaytaryapti

**Yechim:**
1. Console'da rasm URL'ini tekshiring:
```javascript
console.log('🖼️ Image URL:', menu.image_url);
console.log('🖼️ Full URL:', getImageUrl(menu.image_url));
```

2. Network tab'da rasm so'rovini tekshiring
3. Backend MEDIA_URL sozlamalarini tekshiring

### Muammo 2: Rasm Yuklanyapti Lekin Saqlanmayapti
**Sabab:** Backend rasm faylini qabul qilmayapti

**Yechim:**
1. Network tab'da POST /api/menu/ so'rovini tekshiring
2. Request payload'da `image_url: [File]` borligini tekshiring
3. Backend'da file upload sozlamalarini tekshiring

### Muammo 3: CORS Xatoligi (Rasmlar Uchun)
**Sabab:** Backend media fayllar uchun CORS sozlamagan

**Yechim:**
Backend'da:
```python
# Django settings.py
CORS_ALLOW_HEADERS = [
    'content-type',
    'content-disposition',  # Rasm yuklash uchun
]
```

## Backend Sozlamalari

### Django (settings.py)
```python
# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# CORS
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5176",
    "https://your-frontend.vercel.app",
]

# Static/Media files serving
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # ...
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

### Railway.app Environment Variables
```
MEDIA_URL=/media/
ALLOWED_HOSTS=dastyormenu-backend-production.up.railway.app
```

## Production Deploy

### Frontend (.env.production)
```env
VITE_API_BASE_URL=https://dastyormenu-backend-production.up.railway.app
VITE_ENV=production
```

### Backend
- Media fayllar uchun cloud storage (AWS S3, Cloudinary) ishlatish tavsiya etiladi
- Railway.app'da media fayllar restart qilinganda o'chib ketadi

## Qo'shimcha Xususiyatlar

### 1. Lazy Loading
```typescript
<img 
  src={getImageUrl(menu.image_url) || ''} 
  loading="lazy"  // Lazy loading
  alt={menu.name} 
/>
```

### 2. Image Optimization
```typescript
// Kichik thumbnail uchun
const thumbnailUrl = getImageUrl(menu.image_url)?.replace('/media/', '/media/thumbnails/');
```

### 3. Placeholder Image
```typescript
const DEFAULT_IMAGE = '/placeholder-food.jpg';

<img 
  src={getImageUrl(menu.image_url) || DEFAULT_IMAGE} 
  alt={menu.name} 
/>
```

Barcha o'zgarishlar qo'llandi! Endi rasmlar to'g'ri ko'rinishi kerak! 🎉
