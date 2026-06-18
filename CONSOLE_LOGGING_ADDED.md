# Console Logging qo'shildi - Debugging uchun

## 📋 Qo'shilgan loglar

### 1. **MenuPage.tsx** - Modal va Form

#### Modal ochilganda (useEffect)
```
═══════════════════════════════════════════════════════
🔄 MODAL STATE CHANGED
═══════════════════════════════════════════════════════
```
- Modal ochiq/yopiq holati
- Edit mode yoki yangi menu
- Rasm URL'lari (raw va processed)
- Form ma'lumotlari

#### Rasm yuklanganda (handleImageChange)
```
📸 Image file selected: { name, type, size }
✅ File validation passed
🔄 Starting image upload...
✅ Image preview URL ready
✅ Image state updated
🏁 Image upload process completed
```

#### Form submit qilinganda (onSubmit)
```
═══════════════════════════════════════════════════════
🚀 FORM SUBMITTED
═══════════════════════════════════════════════════════
```
- Form ma'lumotlari (name, category, price, etc.)
- Rasm holati (imageUrl, imageFile)
- Organization ID
- Edit mode yoki create mode
- API payload (to'liq)
- API response (success/error)

#### Rasm preview
```
✅ Image preview loaded successfully
❌ Image preview load error
```

#### Menu grid'da rasm yuklanganda
```
✅ Menu image loaded: [menu name]
❌ Menu image load error: { menu, raw_url, processed_url }
```

---

### 2. **menuService.ts** - API Calls

#### Menu yaratish (createMenu)
```
📸 Uploading image file: [name, type, size]
🔵 Creating menu with FormData
  category: [value]
  name: [value]
  price: [value]
  image: [File] [name] ([size] bytes)
```

#### Menu yangilash (updateMenu)
```
🔵 menuService.updateMenu called: { id, data }
📸 Updating with image file: [name, type, size]
🔵 Updating menu with FormData:
  [key]: [value]
📡 Update response: [response]
```

---

### 3. **useMenu.ts** - Image Upload

#### Rasm konvertatsiya qilish
```
🔵 Converting image to base64 for preview...
📸 Original file: { name, type, size }
🔄 Resizing image...
✅ Image resized: { name, type, size }
🔄 Converting to base64...
✅ Image converted to base64 (preview ready)
📏 Base64 length: [characters]
```

#### Menu fetch qilish
```
🔵 Fetching menus and categories...
🖼️ Menu image: [name] → [image_url]
✅ Fetched: [count] menus, [count] categories
```

---

## 🔍 Xatoliklarni topish

### Agar rasm yuklanmasa:
1. Konsolda `📸 Image file selected` ni qidiring
2. `✅ File validation passed` bormi?
3. `✅ Image preview URL ready` bormi?
4. `❌` belgili xatoliklarni qidiring

### Agar edit mode'da rasm ko'rinmasa:
1. `🔄 MODAL STATE CHANGED` ni qidiring
2. `📝 LOADING EDIT DATA` ostida:
   - `Raw image_url` qanday?
   - `Processed image URL` qanday?
3. `✅ Image preview loaded successfully` yoki `❌ Image preview load error` ni tekshiring

### Agar API xatolik bersa:
1. `🚀 FORM SUBMITTED` ni qidiring
2. `📦 Create payload` yoki `📦 Update payload` ni tekshiring
3. `📡 API Response received` ni tekshiring
4. `❌ Menu creation failed` yoki `❌ Menu update failed` ostida error details ni o'qing

### Agar backend xatolik bersa:
1. `🔵 Creating menu with FormData` yoki `🔵 Updating menu with FormData` ni qidiring
2. FormData ichidagi barcha fieldlarni tekshiring
3. `image` field File yoki string ekanligini tekshiring

---

## 🎯 Keyingi qadamlar

1. **Konsolni oching** (F12 yoki Cmd+Option+I)
2. **Console tab**ga o'ting
3. **Filter** qismiga quyidagilarni yozing:
   - `🔵` - barcha operatsiyalar
   - `❌` - faqat xatoliklar
   - `✅` - faqat muvaffaqiyatli operatsiyalar
   - `📸` - faqat rasm bilan bog'liq
   - `📡` - faqat API responselar

4. **Menu qo'shish** yoki **tahrirlash**ni sinab ko'ring
5. **Konsolda** qaysi qadamda xatolik yuz berayotganini toping

---

## 📝 Eslatma

- Barcha loglar Uzbek tilida yozilgan
- Emoji'lar bilan kategoriyalangan:
  - 🔵 = Operatsiya boshlandi
  - ✅ = Muvaffaqiyatli
  - ❌ = Xatolik
  - 📸 = Rasm bilan bog'liq
  - 📡 = API response
  - 🔄 = Jarayon davom etmoqda
  - 📦 = Ma'lumotlar (payload)
  - 🖼️ = Rasm URL
  - 🚀 = Form submit
  - 📝 = Edit mode
  - ➕ = Create mode

---

## 🐛 Backend xatolik

Agar backend `Failed to upload image: 400 C...https://api.imgbb.com/1/upload` xatoligini bersa:

**Sabab:** Backend o'zi ImgBB'ga rasm yuklashga urinmoqda va ImgBB API key noto'g'ri.

**Yechim:**
1. Backend kodini tekshiring
2. ImgBB API key'ni yangilang
3. Yoki backend'ni o'zgartiring - rasm faylni to'g'ridan-to'g'ri qabul qilsin va o'zi saqlash
