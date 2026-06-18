# ⚡ Tezkor Boshlash - API Integratsiya

## 🎯 Nima Qilindi?

Login sahifasi to'liq API bilan integratsiya qilindi va mukammal autentifikatsiya tizimi yaratildi.

## ✨ Yangi Xususiyatlar

### 1. **Ikki Rejimli Ishlash**
- 🔴 **Demo rejim (Mock)** - Backend yo'q, test uchun
- 🟢 **API rejim (Real)** - Backend bilan to'liq integratsiya

### 2. **Mukammal Auth Tizimi**
- ✅ Login/Logout
- ✅ Token boshqaruvi (JWT)
- ✅ Avtomatik token refresh
- ✅ Session management
- ✅ Error handling
- ✅ Loading states

### 3. **Qo'shimcha Funksiyalar**
- 💾 "Eslab qolish" (Remember me)
- 🔑 "Parolni unutdim?" tugmasi
- 🔄 Rejim almashtirish (Mock/API)
- ⚠️ Xatolarni ko'rsatish
- 🎨 Chiroyli UI/UX

## 📁 Yangi Fayllar

```
src/
├── lib/
│   ├── api.ts              # API client (fetch wrapper)
│   ├── authService.ts      # Auth service (login, logout, etc)
│   ├── apiInterceptor.ts   # Token refresh interceptor
│   └── apiTypes.ts         # API type definitions
├── store/
│   └── authStore.ts        # ✏️ Yangilandi (API support)
└── pages/manager/
    └── LoginPage.tsx       # ✏️ Yangilandi (API integration)

.env                        # Environment variables
.env.example               # Environment template
API_INTEGRATION.md         # To'liq API dokumentatsiya
QUICK_START_API.md         # Bu fayl
```

## 🚀 Ishga Tushirish

### 1. Environment Sozlash

`.env` faylini yarating:
```bash
cp .env.example .env
```

`.env` faylini tahrirlang:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000
VITE_ENV=development
```

### 2. Ilovani Ishga Tushirish

```bash
npm install
npm run dev
```

### 3. Login Qilish

**Demo rejim (Mock):**
- Login: `admin` yoki `admin@dastyor.uz`
- Parol: `admin123`

**API rejim (Real):**
- Backend serveringizdan olingan credentials

## 🔧 Backend Talab Qilinadigan Endpointlar

Backend quyidagi endpointlarni implement qilishi kerak:

### 1. Login
```
POST /api/auth/login
Content-Type: application/json

{
  "login": "admin",
  "password": "admin123"
}

Response:
{
  "token": "eyJhbGc...",
  "user": { ... },
  "organization": { ... }
}
```

### 2. Logout
```
POST /api/auth/logout
Authorization: Bearer {token}

Response:
{
  "message": "Muvaffaqiyatli chiqildi"
}
```

### 3. Token Refresh
```
POST /api/auth/refresh
Authorization: Bearer {token}

Response:
{
  "token": "eyJhbGc..."
}
```

### 4. Current User
```
GET /api/auth/me
Authorization: Bearer {token}

Response:
{
  "user": { ... },
  "organization": { ... }
}
```

## 📖 Foydalanish

### API Client

```typescript
import { apiClient } from '@/lib/api';

// GET request
const response = await apiClient.get('/users');

// POST request
const response = await apiClient.post('/users', { name: 'John' });

// Response format
if (response.success) {
  console.log(response.data);
} else {
  console.error(response.error?.message);
}
```

### Auth Service

```typescript
import { authService } from '@/lib/authService';

// Login
const response = await authService.login({
  login: 'admin',
  password: 'admin123'
});

// Logout
await authService.logout();

// Check auth
const isAuth = authService.isAuthenticated();

// Get token
const token = authService.getToken();
```

### Auth Store

```typescript
import { useAuthStore } from '@/store/authStore';

function MyComponent() {
  const { user, organization, signIn, signOut } = useAuthStore();
  
  // Login
  const handleLogin = async () => {
    const error = await signIn('admin', 'admin123');
    if (error) {
      console.error(error);
    }
  };
  
  // Logout
  const handleLogout = async () => {
    await signOut();
  };
  
  return (
    <div>
      {user ? (
        <p>Salom, {user.full_name}!</p>
      ) : (
        <button onClick={handleLogin}>Kirish</button>
      )}
    </div>
  );
}
```

## 🔐 Xavfsizlik

### Token Storage
- Token `localStorage` da saqlanadi
- XSS himoyasi uchun sanitization kerak
- Production da HTTPS majburiy

### Token Refresh
- Access token: 15 daqiqa (tavsiya)
- Refresh token: 7 kun (tavsiya)
- Avtomatik refresh 401 error da

### CORS
Backend CORS ni yoqishi kerak:
```javascript
// Express.js
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

## 🧪 Test Qilish

### 1. Demo Rejimda
```bash
# Ilovani ishga tushiring
npm run dev

# Brauzerda oching
http://localhost:5173

# Login sahifasida "Demo rejim (Mock)" ni tanlang
# Demo credentials bilan kiring
```

### 2. API Rejimda
```bash
# Backend serverni ishga tushiring
# (masalan: http://localhost:3000)

# .env faylini sozlang
VITE_API_BASE_URL=http://localhost:3000/api

# Ilovani ishga tushiring
npm run dev

# Login sahifasida "API rejim (Real)" ni tanlang
# Real credentials bilan kiring
```

## 🐛 Muammolarni Hal Qilish

### 1. CORS Error
```
Access to fetch at 'http://localhost:3000/api/auth/login' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Yechim:** Backend da CORS ni yoqing

### 2. Network Error
```
Tarmoq xatosi
```

**Yechim:** 
- Backend server ishlab turganini tekshiring
- `.env` faylida URL to'g'ri ekanini tekshiring
- Network tab da requestni ko'ring

### 3. Token Expired
```
401 Unauthorized
```

**Yechim:** 
- Avtomatik refresh ishlaydi
- Agar ishlamasa, qayta login qiling

### 4. Timeout Error
```
So'rov vaqti tugadi
```

**Yechim:**
- `.env` da timeout ni oshiring
- Backend response vaqtini tekshiring

## 📚 Qo'shimcha Dokumentatsiya

- **API_INTEGRATION.md** - To'liq API dokumentatsiya
- **ISHGA_TUSHIRISH.md** - Umumiy qo'llanma
- **README.md** - Loyiha haqida

## 🎉 Tayyor!

Endi sizda to'liq ishlaydigan auth tizimi bor:
- ✅ Login/Logout
- ✅ Token management
- ✅ Auto refresh
- ✅ Error handling
- ✅ Mock/API modes
- ✅ Remember me
- ✅ Beautiful UI

Backend serveringizni ulang va ishlatishni boshlang! 🚀

---

**Savollar?** API_INTEGRATION.md faylini o'qing yoki yordam so'rang.
