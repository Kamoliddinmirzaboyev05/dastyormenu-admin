# Tez Test - Menu Qo'shish

## 1. Serverni Ishga Tushiring

```bash
# Frontend
npm run dev

# Backend (agar kerak bo'lsa)
python minimal_backend.py
```

## 2. Login Qiling

- URL: http://localhost:5173
- Login: `superadmin`
- Password: `kamoliddin`

## 3. Menu Sahifasiga O'ting

- Sidebar'dan "Menu" ni bosing

## 4. Yangi Taom Qo'shish

1. "Yangi taom qo'shish" tugmasini bosing
2. Modal ochilishi kerak
3. Rasm yuklang (JPG, PNG, GIF yoki WebP)
4. Barcha maydonlarni to'ldiring:
   - Taom nomi: `Test Osh`
   - Kategoriya: Biror kategoriyani tanlang
   - Narx: `25000`
   - Pishirish vaqti: `30`
5. "Taom qo'shish" tugmasini bosing

## 5. Kutilayotgan Natija

✅ "Taom muvaffaqiyatli qo'shildi" xabari
✅ Modal yopiladi
✅ Yangi taom ro'yxatda ko'rinadi

## 6. Agar Ishlamasa

### A) Modal Ochilmasa
- Browser console'ni tekshiring
- React xatoligi bo'lishi mumkin

### B) Rasm Yuklanmasa
- Rasm formatini tekshiring (faqat JPG, PNG, GIF, WebP)
- Rasm hajmini tekshiring (maksimal 5MB)

### C) Form Submit Bo'lmasa
- Barcha majburiy maydonlar to'ldirilganini tekshiring
- Console'da xatolik xabarini o'qing

### D) API Xatoligi
- Network tab'ni oching (F12 > Network)
- POST /api/menu/ so'rovini toping
- Response'ni o'qing

## 7. Console Loglar

Quyidagi loglarni ko'rishingiz kerak:

```
🔵 Submitting menu: {...}
➕ Creating new menu
✅ Menu created successfully: {...}
```

Agar xatolik bo'lsa:

```
❌ Menu creation failed: {...}
```

## 8. Tez Yechim

Agar hali ham ishlamasa, quyidagini bajaring:

```bash
# Cache tozalash
rm -rf node_modules/.vite
npm run dev
```

Yoki browser'da:
- `Ctrl+Shift+R` (hard reload)
- yoki `Ctrl+Shift+Delete` (cache tozalash)

## 9. Yordam

Agar muammo hal bo'lmasa, menga quyidagilarni yuboring:

1. Browser console screenshot
2. Network tab screenshot
3. Qaysi qadamda xatolik yuz berayotgani

Men sizga yordam beraman! 🚀
