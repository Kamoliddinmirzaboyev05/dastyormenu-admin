# PWA Setup Guide

## ✅ PWA Muvaffaqiyatli O'rnatildi!

Loyiha endi Progressive Web App (PWA) sifatida ishlaydi.

## 🎯 Xususiyatlar

- ✅ Offline ishlash qobiliyati
- ✅ Install button navbar-da
- ✅ Service Worker cache bilan
- ✅ Manifest.json konfiguratsiyasi
- ✅ iOS qo'llab-quvvatlash

## 📱 Qanday Ishlaydi

### Desktop (Chrome, Edge, Safari)
1. Saytni oching
2. Navbar-da "O'rnatish" tugmasini bosing
3. Tasdiqlovchi dialogda "Install" bosing
4. Ilova desktop-ga o'rnatiladi

### Mobile (Android)
1. Chrome-da saytni oching
2. "Add to Home Screen" tugmasini bosing
3. Ilova telefon ekraniga qo'shiladi

### Mobile (iOS)
1. Safari-da saytni oching
2. Share tugmasini bosing
3. "Add to Home Screen" tanlang
4. Ilova telefon ekraniga qo'shiladi

## 🎨 Icon-larni Yaratish

Hozirda placeholder icon-lar ishlatilmoqda. Real icon-lar yaratish uchun:

### 1. Icon Dizayn Qilish
- 512x512 px PNG format
- Shaffof fon yoki rangli fon
- Oddiy va tushunarli dizayn

### 2. Icon-larni Generatsiya Qilish

**Online Tool (Oson):**
- https://realfavicongenerator.net/ saytiga kiring
- 512x512 icon yuklang
- Barcha kerakli o'lchamlar avtomatik yaratiladi

**Yoki qo'lda:**
```bash
# ImageMagick bilan
convert icon-512.png -resize 192x192 public/pwa-192x192.png
convert icon-512.png -resize 512x512 public/pwa-512x512.png
```

### 3. Kerakli Fayllar
```
public/
  ├── pwa-192x192.png    (192x192 px)
  ├── pwa-512x512.png    (512x512 px)
  ├── icon.svg           (SVG format)
  └── manifest.json      (✅ allaqachon bor)
```

## 🔧 Konfiguratsiya

### vite.config.ts
PWA plugin sozlamalari:
- Auto update
- Service Worker cache
- API caching (24 soat)
- Offline support

### Manifest
```json
{
  "name": "Dastyor Manager",
  "short_name": "Dastyor",
  "theme_color": "#F59E0B",
  "background_color": "#0F0F0F",
  "display": "standalone"
}
```

## 🚀 Deploy

### Vercel
```bash
npm run build
vercel --prod
```

PWA avtomatik ishlaydi, qo'shimcha sozlash kerak emas.

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

## 🧪 Test Qilish

### Local Test
```bash
npm run build
npm run preview
```

Keyin browser-da:
1. DevTools > Application > Manifest
2. Service Worker tekshirish
3. Install button ko'rinishini tekshirish

### Production Test
1. HTTPS da deploy qiling (PWA faqat HTTPS da ishlaydi)
2. Chrome DevTools > Lighthouse
3. PWA audit o'tkazing
4. 90+ ball olish kerak

## 📊 Cache Strategiyasi

### API Requests
- Strategy: NetworkFirst
- Cache time: 24 soat
- Max entries: 100

### Static Assets
- Strategy: CacheFirst
- Barcha JS, CSS, images cache qilinadi

## 🔄 Update Mexanizmi

Service Worker avtomatik yangilanadi:
1. Yangi versiya deploy qilinadi
2. Service Worker yangi versiyani yuklab oladi
3. Foydalanuvchi keyingi safar yangi versiyani ko'radi

## 🐛 Troubleshooting

### Install button ko'rinmayapti
- HTTPS ishlatilganini tekshiring
- Browser PWA qo'llab-quvvatlashini tekshiring
- Allaqachon o'rnatilgan bo'lishi mumkin

### Offline ishlamayapti
- Service Worker ro'yxatdan o'tganini tekshiring
- Cache strategiyasini tekshiring
- DevTools > Application > Service Workers

### Icon ko'rinmayapti
- Icon fayllar to'g'ri joyda ekanligini tekshiring
- Manifest.json-da yo'llar to'g'ri ekanligini tekshiring
- Cache-ni tozalang va qayta yuklang

## 📚 Qo'shimcha Ma'lumot

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Workbox](https://developers.google.com/web/tools/workbox)
