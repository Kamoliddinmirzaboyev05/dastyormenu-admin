# 🔑 ImgBB API Key Olish (2 daqiqa)

## Qadam 1: ImgBB Saytiga O'ting

https://imgbb.com/

## Qadam 2: API Sahifasiga O'ting

https://api.imgbb.com/

## Qadam 3: "Get API Key" Tugmasini Bosing

Sahifaning yuqori qismida "Get API key" tugmasi bor.

## Qadam 4: Ro'yxatdan O'ting (Agar Kerak Bo'lsa)

- Email kiriting
- Parol yarating
- "Sign up" tugmasini bosing

## Qadam 5: API Key'ni Nusxalang

Ro'yxatdan o'tgandan keyin, API key ko'rsatiladi:

```
YOUR_API_KEY_HERE_32_CHARACTERS
```

## Qadam 6: API Key'ni Kodga Qo'shing

### Usul 1: To'g'ridan-to'g'ri (Tez)

`src/lib/imageUploadService.ts` faylini oching va 8-qatorda:

```typescript
const IMGBB_API_KEY = 'YOUR_API_KEY_HERE'; // ← Bu yerga qo'ying
```

### Usul 2: .env Fayli Orqali (Xavfsiz)

1. `.env` faylini oching
2. Quyidagini qo'shing:

```env
VITE_IMGBB_API_KEY=YOUR_API_KEY_HERE
```

3. `src/lib/imageUploadService.ts` faylida:

```typescript
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || 'your-imgbb-api-key';
```

## Qadam 7: Serverni Qayta Ishga Tushiring

```bash
# Ctrl+C bilan to'xtating
npm run dev
```

## Qadam 8: Test Qiling

1. Menu sahifasiga o'ting
2. "Yangi taom qo'shish" tugmasini bosing
3. Rasm yuklang
4. Console'da:

```
✅ Image uploaded to ImgBB: https://i.ibb.co/...
```

Agar bu log ko'rinsa, hammasi ishlayapti! ✅

## ❌ Muammolar?

### "Invalid API key"
- API key noto'g'ri nusxalangan
- Probel yoki qo'shimcha belgilar bor
- API key'ni qayta nusxalang

### "Rate limit exceeded"
- Juda ko'p so'rov yuborilgan
- 1 daqiqa kuting va qayta urinib ko'ring

### "Network error"
- Internet aloqasi yo'q
- ImgBB saytiga kirish mumkinmi tekshiring

## 🎉 Tayyor!

API key to'g'ri sozlangandan keyin, rasmlar avtomatik ImgBB'ga yuklanadi va doimiy saqlanadi!

---

**Eslatma:** ImgBB bepul va cheksiz. API key'ni hech kimga bermang!
