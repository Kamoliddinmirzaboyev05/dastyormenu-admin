# Menu Qo'shish - Debug Qo'llanma

## 🔍 Muammoni Aniqlash

### 1. Browser Console'ni Oching
- Chrome/Edge: `F12` yoki `Ctrl+Shift+I`
- Firefox: `F12` yoki `Ctrl+Shift+K`
- Safari: `Cmd+Option+I`

### 2. Console Tab'ga O'ting
Console'da quyidagi loglarni ko'rishingiz kerak:

#### Yangi Taom Qo'shish Jarayoni:
```
🔵 Submitting menu: { name: "...", editMode: false, hasImage: true, ... }
➕ Creating new menu
📸 Image selected: { name: "...", type: "image/jpeg", size: "..." }
✅ Image preview ready
✅ Menu created successfully: { id: "...", name: "...", ... }
```

#### Agar Xatolik Bo'lsa:
```
❌ Menu creation failed: { message: "..." }
```

### 3. Keng Tarqalgan Muammolar

#### A) Rasm Yuklanmayapti
**Belgilari:**
- Rasm preview ko'rinmayapti
- "Iltimos, taom rasmini yuklang" xabari chiqadi

**Yechim:**
```typescript
// useMenu.ts da uploadImage funksiyasini tekshiring
const uploadImage = async (file: File): Promise<string | null> => {
  console.log('🔵 Image will be uploaded with menu creation');
  return URL.createObjectURL(file); // Preview URL
};
```

#### B) Organization ID Topilmayapti
**Belgilari:**
- "Organization ID topilmadi" xabari
- Form submit bo'lmayapti

**Yechim:**
```typescript
// MenuPage.tsx da
const { organization } = useAuthStore();
const orgId = organization?.id ?? '';

console.log('🔍 Organization ID:', orgId);
```

#### C) API Xatoligi
**Belgilari:**
- Network tab'da 400/500 xatolik
- "Taom qo'shilmadi" xabari

**Yechim:**
1. Network tab'ni oching
2. POST /api/menu/ so'rovini toping
3. Request payload'ni tekshiring
4. Response'ni o'qing

### 4. Qadamma-Qadam Test

#### Test 1: Modal Ochilishi
```javascript
// Console'da
console.log('Modal ochildi');
```
✅ Modal ochilishi kerak
❌ Agar ochilmasa: React state muammosi

#### Test 2: Rasm Yuklash
```javascript
// handleImageChange da
console.log('📸 Image selected:', file);
```
✅ File obyekti ko'rinishi kerak
❌ Agar ko'rinmasa: Input element muammosi

#### Test 3: Form Validatsiya
```javascript
// onSubmit da
console.log('🔵 Form data:', data);
```
✅ Barcha maydonlar to'ldirilgan bo'lishi kerak
❌ Agar bo'sh bo'lsa: Zod validatsiya xatoligi

#### Test 4: API So'rov
```javascript
// menuService.createMenu da
console.log('🔵 Creating menu with FormData');
```
✅ FormData to'g'ri yaratilishi kerak
❌ Agar xato bo'lsa: API muammosi

### 5. Tez Yechimlar

#### Yechim 1: Cache Tozalash
```bash
# Terminal'da
npm run build
# yoki
rm -rf node_modules/.vite
```

#### Yechim 2: Browser Cache
- `Ctrl+Shift+R` (hard reload)
- yoki DevTools > Network > "Disable cache"

#### Yechim 3: State Reset
```typescript
// MenuPage.tsx da
React.useEffect(() => {
  console.log('🔍 Modal state:', { showForm, editItem });
}, [showForm, editItem]);
```

### 6. API Endpoint Tekshirish

#### Backend Ishlab Turganini Tekshirish:
```bash
curl http://localhost:8000/
# yoki
curl https://your-api.com/api/menu/
```

#### Expected Response:
```json
{
  "results": [...],
  "count": 10,
  "next": null,
  "previous": null
}
```

### 7. FormData Tekshirish

Console'da FormData'ni ko'rish:
```javascript
// menuService.ts da
for (const [key, value] of formData.entries()) {
  if (value instanceof File) {
    console.log(`${key}: [File] ${value.name}`);
  } else {
    console.log(`${key}: ${value}`);
  }
}
```

Expected output:
```
organization: org-123
category: cat-456
name: Osh
price: 2500000
cook_time_minutes: 30
is_available: true
image_url: [File] osh.jpg
```

### 8. Network Tab Tekshirish

1. DevTools > Network tab
2. "Taom qo'shish" tugmasini bosing
3. POST /api/menu/ so'rovini toping
4. Tekshiring:
   - Status: 200 yoki 201 bo'lishi kerak
   - Request Headers: Content-Type: multipart/form-data
   - Request Payload: Barcha maydonlar mavjud
   - Response: Yangi taom obyekti

### 9. Xatolik Xabarlari

| Xatolik | Sabab | Yechim |
|---------|-------|--------|
| "Organization ID topilmadi" | Auth state bo'sh | Login qiling |
| "Iltimos, taom rasmini yuklang" | Rasm tanlanmagan | Rasm yuklang |
| "Kategoriyani tanlang" | Kategoriya tanlanmagan | Kategoriya tanlang |
| "Narxni kiriting" | Narx kiritilmagan | Narx kiriting |
| "Taom qo'shilmadi" | API xatoligi | Network tab'ni tekshiring |

### 10. Qo'shimcha Debug Kodlar

MenuPage.tsx ga qo'shing:
```typescript
// Debug: Organization
React.useEffect(() => {
  console.log('🔍 Organization:', organization);
  console.log('🔍 Org ID:', orgId);
}, [organization, orgId]);

// Debug: Categories
React.useEffect(() => {
  console.log('🔍 Categories:', categories);
}, [categories]);

// Debug: Form state
React.useEffect(() => {
  console.log('🔍 Form state:', { showForm, editItem });
}, [showForm, editItem]);
```

## 📞 Yordam Kerakmi?

Agar yuqoridagi qadamlar yordam bermasa, quyidagilarni yuboring:

1. Browser console screenshot
2. Network tab screenshot (POST /api/menu/ so'rovi)
3. Qaysi qadamda xatolik yuz berayotgani

Men sizga aniq yechim taqdim etaman! 🚀
