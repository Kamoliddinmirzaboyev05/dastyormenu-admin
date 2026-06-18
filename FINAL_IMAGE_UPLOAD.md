# ✅ Rasm Yuklash - YAKUNIY VERSIYA

## 🎯 Backend API'ga To'liq Mos

Backend API dokumentatsiyasiga ko'ra:
- **Maydon nomi**: `image` (string($binary))
- **Format**: multipart/form-data
- **Majburiy maydonlar**: name, price, category, cook_time_minutes

## O'zgarishlar

### 1. Interface O'zgardi
```typescript
// Oldin:
interface CreateMenuRequest {
  organization: string;  // ❌ Kerak emas
  image_url?: File;      // ❌ Noto'g'ri nom
}

// Endi:
interface CreateMenuRequest {
  name: string;
  category: string;
  price: number;
  cook_time_minutes: number;
  image?: File;          // ✅ To'g'ri nom
}
```

### 2. FormData Maydoni
```typescript
// Oldin:
formData.append('organization', orgId);
formData.append('image_url', file);

// Endi:
formData.append('name', data.name);
formData.append('category', data.category);
formData.append('image', file);  // ✅ Backend kutayotgan nom
```

### 3. Import Tuzatildi
```typescript
// useMenu.ts
import { resizeImage, fileToBase64 } from '../lib/imageUploadService';
```

## Test Qiling

### 1. Serverni Qayta Ishga Tushiring
```bash
npm run dev
```

### 2. Browser'ni Yangilang
```
Ctrl+Shift+R
```

### 3. Yangi Taom Qo'shish

#### Console'da Ko'rishingiz Kerak:

**Rasm Tanlash:**
```
📸 Image selected: { name: "osh.jpg", type: "image/jpeg", size: "245.67 KB" }
🔵 Converting image to base64 for preview...
✅ Image resized: { original: "245.67 KB", resized: "89.23 KB" }
✅ Image converted to base64 (preview ready)
✅ Image preview ready: data:image/jpeg;base64,...
```

**Submit Qilish:**
```
🔵 Submitting menu: { name: "Test Osh", hasImage: true, ... }
➕ Creating new menu with image file
📸 Uploading image file: osh.jpg image/jpeg 91234
🔵 Creating menu with FormData
  name: Test Osh
  category: 3fa85f64-5717-43c2-b3fc-2c963f66afa6
  price: 2500000
  cook_time_minutes: 30
  description: string
  ingredients: string
  is_available: true
  sort_order: 0
  image: [File] osh.jpg (91234 bytes)
✅ Menu created successfully: { id: "...", image_url: "...", ... }
```

## Backend Response

Backend quyidagi formatda javob beradi:

```json
{
  "id": "3fa85f64-5717-43c2-b3fc-2c963f66afa6",
  "organization": "3fa85f64-5717-43c2-b3fc-2c963f66afa6",
  "category": "3fa85f64-5717-43c2-b3fc-2c963f66afa6",
  "name": "Test Osh",
  "description": "string",
  "image_url": "string",
  "price": 2147483647,
  "cook_time_minutes": 2147483647,
  "ingredients": "string",
  "is_available": true,
  "sort_order": 2147483647,
  "created_at": "2025-01-29T11:08:25.093Z",
  "updated_at": "2025-01-29T11:08:25.093Z"
}
```

## Kutilayotgan Natijalar

### ✅ Muvaffaqiyatli:
1. Rasm tanlanganda preview ko'rinadi (base64)
2. Rasm backend'ga yuboriladi (File)
3. Backend rasm URL'ini qaytaradi (`image_url`)
4. Taom qo'shiladi
5. Yangi taomning rasmi ko'rinadi

### ❌ Xatoliklar:

#### Xatolik 1: "fileToBase64 is not defined"
**Sabab:** Import qilinmagan

**Yechim:** ✅ Tuzatildi
```typescript
import { resizeImage, fileToBase64 } from '../lib/imageUploadService';
```

#### Xatolik 2: "organization is required"
**Sabab:** Backend organization maydonini kutayapti

**Yechim:** Backend'da optional qilish yoki frontend'dan yuborish

#### Xatolik 3: "image field is required"
**Sabab:** Rasm tanlanmagan

**Yechim:** Rasm yuklang

## Network Tab'da Ko'rish

### Request:
```
POST /api/menu/
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...

------WebKitFormBoundary...
Content-Disposition: form-data; name="name"

Test Osh
------WebKitFormBoundary...
Content-Disposition: form-data; name="category"

3fa85f64-5717-43c2-b3fc-2c963f66afa6
------WebKitFormBoundary...
Content-Disposition: form-data; name="price"

2500000
------WebKitFormBoundary...
Content-Disposition: form-data; name="image"; filename="osh.jpg"
Content-Type: image/jpeg

[binary data]
------WebKitFormBoundary...
```

### Response:
```json
{
  "id": "...",
  "name": "Test Osh",
  "image_url": "https://backend.com/media/menu/osh.jpg",
  ...
}
```

## Rasm Ko'rsatish

Backend `image_url` maydonida rasm URL'ini qaytaradi:

```typescript
// Frontend'da
<img src={getImageUrl(menu.image_url)} alt={menu.name} />
```

`getImageUrl()` funksiyasi:
- To'liq URL bo'lsa: o'zini qaytaradi
- Nisbiy yo'l bo'lsa: backend URL bilan birlashtiradi

## Muhim Eslatmalar

1. **Maydon Nomlari:**
   - Backend kutadi: `image` (File)
   - Backend qaytaradi: `image_url` (string)

2. **Narx Formati:**
   - Frontend: so'm (25000)
   - Backend: tiyin (2500000)
   - Konversiya: `som * 100`

3. **Category:**
   - UUID format: `3fa85f64-5717-43c2-b3fc-2c963f66afa6`
   - Dropdown'dan tanlanadi

4. **Rasm Optimization:**
   - Maksimal o'lcham: 800x800px
   - Sifat: 85%
   - Format: JPG, PNG, GIF, WebP

## Muammolar?

Agar hali ham ishlamasa:

1. **Console'ni tekshiring** - qaysi qadamda xatolik?
2. **Network tab'ni tekshiring** - request to'g'rimi?
3. **Backend log'larini tekshiring** - xatolik xabari?

Console screenshot yuboring, men yordam beraman! 🚀

## Barcha Fayllardagi O'zgarishlar

### ✅ src/hooks/useMenu.ts
- `fileToBase64` import qilindi
- `uploadImage` funksiyasi base64 preview yaratadi

### ✅ src/lib/menuService.ts
- `CreateMenuRequest` interface yangilandi
- `UpdateMenuRequest` interface yangilandi
- `image_url` → `image` o'zgardi
- `organization` olib tashlandi

### ✅ src/pages/manager/MenuPage.tsx
- `image_url` → `image` o'zgardi
- `organization` olib tashlandi

Barcha o'zgarishlar backend API'ga to'liq mos! ✅
