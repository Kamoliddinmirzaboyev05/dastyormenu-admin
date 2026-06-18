# 🔐 Login API - To'liq Qo'llanma

## ✅ Nima Qilindi?

Login sahifasi mukammal qilib yaratildi va tokenlar **sessionStorage** da saqlanadi.

## 🎯 Asosiy Xususiyatlar

### 1. **SessionStorage Ishlatish**
- ✅ Tokenlar sessionStorage da saqlanadi (localStorage emas)
- ✅ Tab yopilganda avtomatik tozalanadi
- ✅ Xavfsizroq (XSS hujumlariga qarshi)
- ✅ Access token va refresh token alohida saqlanadi

### 2. **API Integratsiya**
- ✅ Backend URL: `http://localhost:8000`
- ✅ Login endpoint: `POST /api/auth/login`
- ✅ Logout endpoint: `POST /api/auth/logout`
- ✅ Refresh endpoint: `POST /api/auth/refresh`
- ✅ Current user: `GET /api/auth/me`

### 3. **Token Management**
- ✅ Access token va refresh token
- ✅ Avtomatik token refresh (401 error da)
- ✅ Token expiry handling
- ✅ Secure storage

### 4. **UI/UX**
- ✅ Chiroyli error messages
- ✅ Loading states
- ✅ "Eslab qolish" funksiyasi
- ✅ "Parolni unutdim?" tugmasi
- ✅ Form validation

## 📡 API Request/Response Format

### Login Request

```bash
POST http://localhost:8000/api/auth/login
Content-Type: application/json

{
  "login": "manager",
  "password": "admin1admin"
}
```

### Login Response (Success - 200)

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "3fe85f64-5717-4562-b3fc-2c963f66afa6",
    "username": "manager",
    "email": "user@example.com",
    "first_name": "Muhammad",
    "last_name": "Aliqulov",
    "role": "manager",
    "is_active": true,
    "created_at": "2025-04-23T07:15:44.825Z",
    "updated_at": "2025-04-23T07:15:44.825Z"
  },
  "organization": {
    "id": "3fe85f64-5717-4562-b3fc-2c963f66afa6",
    "full_name": "Kamil Iddin",
    "role": "manager",
    "is_active": true
  }
}
```

### Login Response (Error - 401)

```json
{
  "detail": "Incorrect username or password"
}
```

## 💾 SessionStorage Structure

### Saqlangan Ma'lumotlar

```javascript
// Access token
sessionStorage.getItem('dastyor_token')
// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// Refresh token
sessionStorage.getItem('dastyor_refresh_token')
// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// User and organization data
sessionStorage.getItem('dastyor_auth')
// '{"user":{...},"organization":{...}}'

// Saved login (if "Remember me" checked)
sessionStorage.getItem('dastyor_saved_login')
// "manager"
```

### SessionStorage vs LocalStorage

| Feature | SessionStorage | LocalStorage |
|---------|---------------|--------------|
| **Muddati** | Tab yopilganda o'chadi | Doimiy |
| **Xavfsizlik** | Xavfsizroq | Kamroq xavfsiz |
| **Hajmi** | ~5-10MB | ~5-10MB |
| **Scope** | Faqat joriy tab | Barcha tablar |
| **Use case** | Auth tokens | Settings, preferences |

## 🔧 Code Examples

### 1. Login Qilish

```typescript
import { authService } from '@/lib/authService';

const handleLogin = async () => {
  const response = await authService.login({
    login: 'manager',
    password: 'admin1admin'
  });

  if (response.success) {
    console.log('Login successful!');
    console.log('User:', response.data?.user);
    console.log('Organization:', response.data?.organization);
  } else {
    console.error('Login failed:', response.error?.message);
  }
};
```

### 2. Token Olish

```typescript
import { authService } from '@/lib/authService';

// Get access token
const token = authService.getToken();
console.log('Access token:', token);

// Check if authenticated
const isAuth = authService.isAuthenticated();
console.log('Is authenticated:', isAuth);
```

### 3. Logout Qilish

```typescript
import { authService } from '@/lib/authService';

const handleLogout = async () => {
  await authService.logout();
  console.log('Logged out successfully');
  // All sessionStorage data cleared
};
```

### 4. Current User Olish

```typescript
import { authService } from '@/lib/authService';

const getCurrentUser = async () => {
  const response = await authService.getCurrentUser();
  
  if (response.success) {
    console.log('User:', response.data?.user);
    console.log('Organization:', response.data?.organization);
  }
};
```

## 🔄 Token Refresh Flow

### Avtomatik Refresh

1. API request yuboriladi
2. Server 401 Unauthorized qaytaradi
3. Interceptor tokenni avtomatik yangilaydi
4. Original request qayta yuboriladi
5. Agar refresh failed bo'lsa, logout qilinadi

### Manual Refresh

```typescript
import { authService } from '@/lib/authService';

const refreshToken = async () => {
  const response = await authService.refreshToken();
  
  if (response.success) {
    console.log('Token refreshed successfully');
  } else {
    console.error('Token refresh failed');
    // User will be logged out automatically
  }
};
```

## 🚀 Ishga Tushirish

### 1. Environment Sozlash

`.env` faylini tekshiring:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT=30000
VITE_ENV=production
```

### 2. Backend Serverni Ishga Tushiring

```bash
# Backend papkasida
uvicorn main:app --reload --port 8000
```

### 3. Frontend Serverni Ishga Tushiring

```bash
npm install
npm run dev
```

### 4. Brauzerda Oching

```
http://localhost:5173
```

### 5. Login Qiling

Backend serverdan olingan credentials bilan kiring.

## 🧪 Test Qilish

### Browser Console da Test

```javascript
// Login
const response = await fetch('http://localhost:8000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ login: 'manager', password: 'admin1admin' })
});
const data = await response.json();
console.log(data);

// Check sessionStorage
console.log('Token:', sessionStorage.getItem('dastyor_token'));
console.log('Auth:', sessionStorage.getItem('dastyor_auth'));
```

### cURL bilan Test

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"manager","password":"admin1admin"}'
```

## 🐛 Muammolarni Hal Qilish

### 1. Token Topilmadi

**Muammo:** `Token not found in sessionStorage`

**Yechim:**
- Login qilganingizni tekshiring
- Browser console da sessionStorage ni tekshiring
- Tab yopilmagan ekanini tekshiring

### 2. CORS Error

**Muammo:** `Access to fetch has been blocked by CORS policy`

**Yechim:**
```python
# Backend (FastAPI)
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 3. 401 Unauthorized

**Muammo:** `Unauthorized - Token expired`

**Yechim:**
- Token avtomatik refresh qilinadi
- Agar refresh failed bo'lsa, qayta login qiling

### 4. Network Error

**Muammo:** `Tarmoq xatosi`

**Yechim:**
- Backend server ishlab turganini tekshiring
- `.env` faylida URL to'g'ri ekanini tekshiring
- Browser Network tab da requestni ko'ring

## 🔒 Xavfsizlik

### Best Practices

1. **SessionStorage Ishlatish**
   - ✅ Tab yopilganda avtomatik tozalanadi
   - ✅ XSS hujumlariga qarshi himoya
   - ✅ Faqat joriy tab uchun

2. **HTTPS Ishlatish**
   - ✅ Production da faqat HTTPS
   - ✅ Token shifrlangan holda yuboriladi

3. **Token Expiry**
   - ✅ Access token: 15 daqiqa (tavsiya)
   - ✅ Refresh token: 7 kun (tavsiya)

4. **CORS Configuration**
   - ✅ Faqat kerakli originlarni ruxsat berish
   - ✅ Credentials ni yoqish

## 📊 Response Mapping

Frontend quyidagi response formatni kutadi:

```typescript
interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: UserProfile;
  organization: Organization;
}
```

Agar backend boshqa format qaytarsa, `src/lib/authService.ts` da mapping qo'shing.

## 📁 O'zgartirilgan Fayllar

```
src/
├── lib/
│   ├── api.ts              ✏️ sessionStorage
│   ├── authService.ts      ✏️ sessionStorage, access_token, refresh_token
│   └── apiTypes.ts         ✏️ LoginResponse format
└── pages/manager/
    └── LoginPage.tsx       ✏️ sessionStorage

.env                        ✏️ API URL
LOGIN_API_GUIDE.md         ✨ Bu fayl
```

## 🎉 Tayyor!

Login sahifasi mukammal ishlaydi:
- ✅ Faqat API orqali
- ✅ SessionStorage da token saqlash
- ✅ Access token va refresh token
- ✅ Avtomatik token refresh
- ✅ Chiroyli UI/UX
- ✅ Error handling
- ✅ Remember me
- ✅ Xavfsiz

---

**Backend serveringizni ulang va ishlatishni boshlang!** 🚀
