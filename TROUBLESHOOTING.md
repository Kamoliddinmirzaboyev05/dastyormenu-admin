# 🔧 Muammolarni Hal Qilish

## ❌ "Unexpected token '<', "<!DOCTYPE "... is not valid JSON"

### Sabab
Bu xatolik server HTML sahifa qaytarganda yuzaga keladi (JSON o'rniga). Quyidagi holatlar bo'lishi mumkin:

1. **Backend server ishlamayapti**
2. **Noto'g'ri API URL**
3. **CORS xatosi**
4. **404 Not Found**
5. **500 Server Error**

### Yechim

#### 1. Backend Serverni Tekshiring

```bash
# Backend server ishlab turganini tekshiring
curl http://localhost:8000

# Yoki brauzerda oching
http://localhost:8000
```

Agar server ishlamasa:
```bash
# Backend papkasida
uvicorn main:app --reload --port 8000
```

#### 2. API URL ni Tekshiring

`.env` faylini oching va URL ni tekshiring:
```env
VITE_API_BASE_URL=http://localhost:8000
```

**MUHIM:** Port raqami to'g'ri bo'lishi kerak!

#### 3. API Endpoint ni Tekshiring

Browser console da quyidagi loglarni ko'ring:
```
🔵 API Request: http://localhost:8000/api/auth/login POST
```

Agar URL noto'g'ri bo'lsa, `.env` faylini o'zgartiring va serverni qayta ishga tushiring:
```bash
npm run dev
```

#### 4. CORS ni Tekshiring

Backend da CORS yoqilganini tekshiring:

**FastAPI:**
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Express.js:**
```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

#### 5. Backend Endpoint ni Test Qiling

```bash
# cURL bilan test
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"manager","password":"admin1admin"}'
```

Agar JSON response qaytarsa, backend to'g'ri ishlayapti.

## 🔍 Browser Console da Debug

### 1. Console ni Oching
- Chrome/Edge: `F12` yoki `Ctrl+Shift+I`
- Firefox: `F12` yoki `Ctrl+Shift+K`
- Safari: `Cmd+Option+I`

### 2. Network Tab ni Tekshiring

1. Network tab ni oching
2. Login qiling
3. `/api/auth/login` requestni toping
4. Response ni ko'ring

**Agar response HTML bo'lsa:**
- Backend server ishlamayapti
- Yoki noto'g'ri URL

**Agar response JSON bo'lsa:**
- Backend to'g'ri ishlayapti
- Frontend xatosi bo'lishi mumkin

### 3. Console Loglarni Ko'ring

Quyidagi loglar ko'rinishi kerak:
```
🔵 API Request: http://localhost:8000/api/auth/login POST
🟢 API Response: 200 OK
📦 Response data: {access_token: "...", user: {...}}
```

Agar qizil xatolar ko'rinsa:
```
❌ Server returned non-JSON response: text/html
❌ API Error: Failed to fetch
```

Bu backend server ishlamayotganini bildiradi.

## 🚨 Keng Tarqalgan Xatolar

### 1. "Failed to fetch"

**Sabab:** Backend serverga ulanib bo'lmadi

**Yechim:**
- Backend server ishlab turganini tekshiring
- Port raqami to'g'ri ekanini tekshiring
- Firewall backend portini bloklayotganini tekshiring

### 2. "CORS policy" xatosi

**Sabab:** Backend CORS yoqilmagan

**Yechim:**
- Backend da CORS middleware qo'shing
- `allow_origins` da frontend URL ni qo'shing

### 3. "401 Unauthorized"

**Sabab:** Login yoki parol noto'g'ri

**Yechim:**
- Login va parolni tekshiring
- Backend da user mavjudligini tekshiring

### 4. "Network Error"

**Sabab:** Internet yoki server bilan bog'lanish muammosi

**Yechim:**
- Internet ulanishini tekshiring
- Backend server ishlab turganini tekshiring
- VPN yoki proxy sozlamalarini tekshiring

## 📋 Tekshirish Ro'yxati

### Backend

- [ ] Backend server ishlab turibdi
- [ ] Port to'g'ri (8000)
- [ ] CORS yoqilgan
- [ ] `/api/auth/login` endpoint mavjud
- [ ] Request body to'g'ri formatda
- [ ] Response JSON formatda

### Frontend

- [ ] `.env` fayli mavjud
- [ ] `VITE_API_BASE_URL` to'g'ri
- [ ] Port to'g'ri (5173)
- [ ] Browser console da xatolar yo'q
- [ ] Network tab da request ko'rinadi

### Test

```bash
# 1. Backend test
curl http://localhost:8000

# 2. Login endpoint test
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"test","password":"test"}'

# 3. Frontend test
npm run dev
# Brauzerda: http://localhost:5173
```

## 🔧 Qo'shimcha Debugging

### 1. Verbose Logging

`src/lib/api.ts` da logging yoqilgan:
```typescript
console.log('🔵 API Request:', fullUrl, options.method);
console.log('🟢 API Response:', response.status);
console.log('📦 Response data:', data);
```

### 2. Network Tab

Browser Network tab da:
- Request URL
- Request Method
- Request Headers
- Request Body
- Response Status
- Response Headers
- Response Body

### 3. Backend Logs

Backend server loglarini ko'ring:
```bash
# FastAPI
uvicorn main:app --reload --log-level debug

# Express.js
DEBUG=* node server.js
```

## 💡 Maslahatlar

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
- Safari: `Cmd+Option+E`

### 3. Hard Reload

Browser ni hard reload qiling:
- Chrome/Firefox: `Ctrl+Shift+R`
- Safari: `Cmd+Shift+R`

### 4. Incognito Mode

Incognito/Private mode da test qiling:
- Chrome: `Ctrl+Shift+N`
- Firefox: `Ctrl+Shift+P`
- Safari: `Cmd+Shift+N`

## 📞 Yordam

Agar muammo hal bo'lmasa:

1. Browser console screenshot oling
2. Network tab screenshot oling
3. Backend logs ni ko'ring
4. `.env` faylini tekshiring
5. Backend server ishlab turganini tekshiring

---

**Omad! 🚀**
