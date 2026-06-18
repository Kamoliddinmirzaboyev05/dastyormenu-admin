# 🧪 Rasm Yuklashni Test Qilish

## 1. Serverni Qayta Ishga Tushiring

```bash
# Ctrl+C bilan to'xtating
npm run dev
```

## 2. Browser'ni Yangilang

- `Ctrl+Shift+R` (hard reload)
- yoki `Ctrl+Shift+Delete` (cache tozalash)

## 3. Console'ni Oching

- `F12` yoki `Ctrl+Shift+I`
- Console tab'ga o'ting

## 4. Menu Sahifasiga O'ting

- Sidebar'dan "Menyu" ni bosing
- Console'da quyidagi loglarni ko'ring:

```
🔵 Fetching menus and categories...
🖼️ Menu image: Taom nomi → /media/menu/...
✅ Fetched: X menus, Y categories
```

## 5. Mavjud Taomlarni Tekshiring

- Agar taomlar bor bo'lsa, ularning rasmlari ko'rinishi kerak
- Agar rasm ko'rinmasa, console'da xatolik xabari bo'ladi:

```
❌ Image load error: /media/menu/...
```

## 6. Yangi Taom Qo'shish

### A) Modal Ochish
1. "Yangi taom qo'shish" tugmasini bosing
2. Modal ochilishi kerak

### B) Rasm Yuklash
1. Rasm yuklash maydonini bosing
2. Rasm tanlang (JPG, PNG, GIF yoki WebP)
3. Console'da:

```
📸 Image selected: { name: "...", type: "image/jpeg", size: "... KB" }
✅ Image preview ready: blob:http://localhost:5176/...
```

4. Rasm preview ko'rinishi kerak

### C) Formni To'ldirish
1. Taom nomi: `Test Osh`
2. Kategoriya: Biror kategoriyani tanlang
3. Narx: `25000`
4. Pishirish vaqti: `30`

### D) Submit Qilish
1. "Taom qo'shish" tugmasini bosing
2. Console'da:

```
🔵 Submitting menu: { name: "Test Osh", hasImage: true, ... }
➕ Creating new menu
📸 Uploading image file: test.jpg image/jpeg 123456
  organization: org-123
  category: cat-456
  name: Test Osh
  price: 2500000
  cook_time_minutes: 30
  is_available: true
  image_url: [File] test.jpg (123456 bytes)
✅ Menu created successfully: { id: "...", image_url: "/media/menu/..." }
```

3. Toast xabari: "Taom muvaffaqiyatli qo'shildi"
4. Modal yopiladi
5. Yangi taom ro'yxatda ko'rinadi

### E) Yangi Taomni Tekshirish
1. Ro'yxatda yangi taomni toping
2. Rasm ko'rinishi kerak
3. Console'da:

```
🖼️ Menu image: Test Osh → /media/menu/test.jpg
```

## 7. Kutilayotgan Natijalar

### ✅ Muvaffaqiyatli:
- Rasm preview ko'rinadi
- Rasm yuklanyapti (console'da log)
- Taom qo'shildi (toast xabari)
- Yangi taom ro'yxatda ko'rinadi
- Yangi taomning rasmi ko'rinadi

### ❌ Xatoliklar:

#### Xatolik 1: "Iltimos, taom rasmini yuklang"
**Sabab:** Rasm tanlanmagan
**Yechim:** Rasm yuklang

#### Xatolik 2: "Faqat JPG, PNG, GIF yoki WebP formatdagi rasmlar qabul qilinadi"
**Sabab:** Noto'g'ri format
**Yechim:** To'g'ri formatdagi rasm yuklang

#### Xatolik 3: "Rasm hajmi 5MB dan oshmasligi kerak"
**Sabab:** Rasm juda katta
**Yechim:** Kichikroq rasm yuklang

#### Xatolik 4: Rasm preview ko'rinmayapti
**Sabab:** uploadImage funksiyasi ishlamayapti
**Yechim:** Console'da xatolikni tekshiring

#### Xatolik 5: Taom qo'shildi lekin rasmi yo'q
**Sabab:** Backend rasm URL'ini noto'g'ri qaytaryapti
**Yechim:** 
1. Console'da rasm URL'ini tekshiring
2. Network tab'da response'ni tekshiring
3. Backend MEDIA_URL sozlamalarini tekshiring

## 8. Network Tab Tekshirish

### POST /api/menu/ So'rovi:
1. DevTools > Network tab
2. "Taom qo'shish" tugmasini bosing
3. POST /api/menu/ so'rovini toping
4. Tekshiring:

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Payload: FormData with image file

**Response:**
- Status: 200 yoki 201
- Body: 
```json
{
  "id": "...",
  "name": "Test Osh",
  "image_url": "/media/menu/test.jpg",
  ...
}
```

### GET /media/menu/... So'rovi:
1. Taom qo'shilgandan keyin
2. GET /media/menu/test.jpg so'rovini toping
3. Tekshiring:
- Status: 200
- Content-Type: image/jpeg
- Preview: Rasm ko'rinishi kerak

## 9. Muammolarni Hal Qilish

### Muammo: Rasm ko'rinmayapti

**Qadam 1:** Console'ni tekshiring
```javascript
// Quyidagi logni qidiring:
🖼️ Menu image: Test Osh → /media/menu/test.jpg

// Agar URL noto'g'ri bo'lsa:
❌ Image load error: /media/menu/test.jpg
```

**Qadam 2:** Network tab'ni tekshiring
- GET /media/menu/test.jpg so'rovi bormi?
- Status code nima? (200, 404, 403?)
- Response nima? (rasm yoki xatolik?)

**Qadam 3:** Backend'ni tekshiring
- Backend ishlab turibdimi?
- MEDIA_URL to'g'ri sozlanganmi?
- Media fayllar to'g'ri joyda saqlanganmi?

**Qadam 4:** Proxy'ni tekshiring
- vite.config.ts'da proxy bormi?
- Proxy to'g'ri sozlanganmi?

## 10. Yordam

Agar muammo hal bo'lmasa, menga quyidagilarni yuboring:

1. **Console screenshot** - barcha loglar bilan
2. **Network tab screenshot** - POST /api/menu/ va GET /media/... so'rovlari
3. **Backend response** - POST /api/menu/ javobidagi image_url

Men sizga aniq yechim beraman! 🚀

## 11. Qo'shimcha Test

### Tahrirlash:
1. Mavjud taomni tahrirlang
2. Yangi rasm yuklang
3. Saqlang
4. Yangi rasm ko'rinishi kerak

### O'chirish:
1. Taomni o'chiring
2. Ro'yxatdan yo'qolishi kerak

### Stop-list:
1. Taomni stop-listga qo'shing
2. "STOP" belgisi ko'rinishi kerak
3. Rasm xira ko'rinishi kerak

Barcha testlar muvaffaqiyatli bo'lishi kerak! ✅
