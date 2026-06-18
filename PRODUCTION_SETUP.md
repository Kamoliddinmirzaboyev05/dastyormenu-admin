# 🚀 Production Backend Setup

## ✅ Backend URL

Production backend Railway da deploy qilingan:

```
https://dastyormenu-backend-production.up.railway.app
```

## 🔧 Sozlash

### 1. Environment Variables

`.env` fayli avtomatik yangilandi:

```env
VITE_API_BASE_URL=https://dastyormenu-backend-production.up.railway.app
VITE_API_TIMEOUT=30000
VITE_ENV=production
```

### 2. API Endpoints

**Base URL:**
```
https://dastyormenu-backend-production.up.railway.app
```

**Login Endpoint:**
```
POST https://dastyormenu-backend-production.up.railway.app/api/auth/login/
```

**Note:** URL oxirida `/` bor!

## 🧪 Test Qilish

### 1. Backend Connection Test

```bash
curl https://dastyormenu-backend-production.up.railway.app
```

**Expected Response:**
```json
{
  "message": "Backend is running"
}
```

### 2. Login Test

```bash
curl -X POST https://dastyormenu-backend-production.up.railway.app/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"login":"superadmin","password":"kamoliddin"}'
```

**Expected Response:**
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "user": {
    "id": "...",
    "username": "superadmin",
    "email": "...",
    "role": "manager",
    "is_active": true
  },
  "organization": {
    "id": "...",
    "full_name": "...",
    "is_active": true
  }
}
```

## 🚀 Ishga Tushirish

### 1. Dependencies O'rnating

```bash
npm install
```

### 2. Development Server

```bash
npm run dev
```

### 3. Browser

```
http://localhost:5173
```

### 4. Login

Production backend credentials bilan kiring.

## 🔍 Debug

### Browser Console

F12 bosing va Console tab ni oching:

```
🔵 API Request: https://dastyormenu-backend-production.up.railway.app/api/auth/login/ POST
🟢 API Response: 200 OK
📦 Response data: {access_token: "...", user: {...}}
```

### Network Tab

F12 > Network > `/api/auth/login/`:
- Request URL: `https://dastyormenu-backend-production.up.railway.app/api/auth/login/`
- Request Method: `POST`
- Status: `200 OK`
- Response: JSON

## ⚠️ Muhim Eslatmalar

### 1. URL Oxirida `/` Bor

Backend endpoint oxirida `/` bor:
```
✅ /api/auth/login/
❌ /api/auth/login
```

Agar `/` yo'q bo'lsa, 404 error chiqishi mumkin.

### 2. HTTPS

Production backend HTTPS ishlatadi:
```
✅ https://dastyormenu-backend-production.up.railway.app
❌ http://dastyormenu-backend-production.up.railway.app
```

### 3. CORS

Production backend CORS yoqilgan bo'lishi kerak:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # yoki specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🐛 Troubleshooting

### Error 1: 404 Not Found

**Sabab:** URL oxirida `/` yo'q

**Yechim:**
```
✅ /api/auth/login/
❌ /api/auth/login
```

### Error 2: CORS Error

**Sabab:** Backend CORS yoqilmagan

**Yechim:** Backend da CORS middleware qo'shing

### Error 3: 500 Internal Server Error

**Sabab:** Backend xatosi

**Yechim:** Backend loglarni tekshiring (Railway dashboard)

### Error 4: Network Error

**Sabab:** Backend ishlamayapti yoki internet yo'q

**Yechim:**
- Internet ulanishini tekshiring
- Backend status ni tekshiring: `curl https://dastyormenu-backend-production.up.railway.app`

## 📊 Production vs Development

| Feature | Development | Production |
|---------|-------------|------------|
| **URL** | http://localhost:8000 | https://dastyormenu-backend-production.up.railway.app |
| **Protocol** | HTTP | HTTPS |
| **CORS** | Localhost only | All origins |
| **Logging** | Verbose | Minimal |
| **Database** | Local | Railway PostgreSQL |

## 🔐 Security

### 1. Environment Variables

`.env` faylini `.gitignore` ga qo'shing:
```
.env
.env.local
.env.production
```

### 2. HTTPS

Production da faqat HTTPS ishlatiladi.

### 3. Credentials

Production credentials ni xavfsiz saqlang:
- Environment variables
- Secret management tools
- Password managers

## 📝 Credentials

Production backend credentials:
- Backend admin dan oling
- Yoki Railway dashboard dan ko'ring

## 🎯 Next Steps

1. ✅ `.env` fayli yangilandi
2. ✅ API client yangilandi
3. ✅ Production URL sozlandi
4. 🔄 Frontend serverni qayta ishga tushiring
5. 🧪 Login qilib ko'ring

## 💡 Tips

### 1. Environment Variables

`.env` faylini o'zgartirgandan keyin serverni qayta ishga tushiring:
```bash
# Ctrl+C bilan to'xtating
npm run dev
```

### 2. Cache Tozalash

Browser cache ni tozalang:
- Chrome: `Ctrl+Shift+Delete`
- Firefox: `Ctrl+Shift+Delete`

### 3. Hard Reload

Browser ni hard reload qiling:
- Chrome/Firefox: `Ctrl+Shift+R`

### 4. Incognito Mode

Incognito mode da test qiling:
- Chrome: `Ctrl+Shift+N`

## 📞 Yordam

Agar muammo bo'lsa:

1. Browser console ni tekshiring (F12)
2. Network tab ni tekshiring
3. Backend status ni tekshiring
4. `.env` faylini tekshiring
5. Server qayta ishga tushiring

---

**Omad! 🚀**

**Production backend tayyor!**
