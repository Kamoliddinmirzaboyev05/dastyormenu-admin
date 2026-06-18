# 🚀 API Sozlash Qo'llanmasi

## ✅ Nima O'zgardi?

Login sahifasi **faqat API orqali** ishlaydi. Demo ma'lumotlar va mock rejim butunlay olib tashlandi.

## 📡 API Konfiguratsiya

### Backend URL

`.env` faylida API URL sozlangan:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT=30000
VITE_ENV=production
```

### API Endpoint

Login uchun endpoint:
```
POST http://localhost:8000/api/auth/login
```

## 📝 Request Format

### Request Body

```json
{
  "login": "username",
  "password": "password"
}
```

### Request Headers

```
Content-Type: application/json
```

## ✅ Response Format

### Success Response (200)

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "3fe85f64-5717-4562-b3fc-2c963f66afa6",
    "username": "superadmin",
    "email": "user@example.com",
    "first_name": "",
    "last_name": "",
    "role": "manager",
    "is_active": true,
    "created_at": "2025-04-23T07:15:44.825Z",
    "updated_at": "2025-04-23T07:15:44.825Z"
  },
  "organization": {
    "id": "3fe85f64-5717-4562-b3fc-2c963f66afa6",
    "full_name": "string",
    "role": "manager",
    "is_active": true
  }
}
```

### Error Response (401)

```json
{
  "detail": "Incorrect username or password"
}
```

## 🔧 Backend Requirements

Backend quyidagi endpointlarni implement qilishi kerak:

### 1. Login
```
POST /api/auth/login
Content-Type: application/json

Body:
{
  "login": "string",
  "password": "string"
}

Response:
{
  "token": "string",
  "user": { ... },
  "organization": { ... }
}
```

### 2. Logout
```
POST /api/auth/logout
Authorization: Bearer {token}
```

### 3. Token Refresh
```
POST /api/auth/refresh
Authorization: Bearer {token}

Response:
{
  "token": "string"
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

## 🔐 CORS Configuration

Backend CORS ni yoqishi kerak:

```python
# FastAPI example
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🚀 Ishga Tushirish

### 1. Backend Serverni Ishga Tushiring

```bash
# Backend papkasida
uvicorn main:app --reload --port 8000
```

### 2. Frontend Serverni Ishga Tushiring

```bash
# Frontend papkasida
npm install
npm run dev
```

### 3. Brauzerda Oching

```
http://localhost:5173
```

### 4. Login Qiling

Backend serverdan olingan credentials bilan kiring.

## 🧪 Test Qilish

### cURL bilan test

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"superadmin","password":"admin123"}'
```

### Postman bilan test

1. Postman ochilsin
2. POST request yarating: `http://localhost:8000/api/auth/login`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "login": "superadmin",
  "password": "admin123"
}
```
5. Send bosing

## 🐛 Muammolarni Hal Qilish

### 1. CORS Error

```
Access to fetch has been blocked by CORS policy
```

**Yechim:** Backend da CORS ni yoqing (yuqoridagi CORS Configuration ga qarang)

### 2. Network Error

```
Tarmoq xatosi
```

**Yechim:**
- Backend server ishlab turganini tekshiring: `http://localhost:8000`
- `.env` faylida URL to'g'ri ekanini tekshiring
- Browser console da xatolarni ko'ring (F12)

### 3. 401 Unauthorized

```
Login yoki parol noto'g'ri
```

**Yechim:**
- Login va parol to'g'ri ekanini tekshiring
- Backend da user mavjudligini tekshiring
- Backend logs ni ko'ring

### 4. Timeout Error

```
So'rov vaqti tugadi
```

**Yechim:**
- Backend server javob berayotganini tekshiring
- `.env` da timeout ni oshiring: `VITE_API_TIMEOUT=60000`

## 📊 Response Mapping

Frontend quyidagi response formatni kutadi:

```typescript
{
  token: string;           // JWT access token
  user: {
    id: string;
    organization_id: string;
    full_name: string;
    role: 'manager' | 'chef' | 'waiter';
    username: string;
    email?: string;
    pin_code: string;
    is_active: boolean;
  };
  organization: {
    id: string;
    name: string;
    logo_url: string | null;
    address: string | null;
    phone: string | null;
    subscription_plan: string;
    subscription_status: string;
    subscription_expires_at: string | null;
    trial_ends_at: string | null;
    monthly_price: number;
  };
}
```

Agar backend boshqa format qaytarsa, `src/lib/authService.ts` faylida mapping qo'shish kerak.

## 🔒 Xavfsizlik

### Token Storage

Token `localStorage` da saqlanadi:
```typescript
localStorage.setItem('dastyor_token', token);
```

### Token Refresh

Token muddati tugaganda (401 error) avtomatik yangilanadi.

### HTTPS

Production da faqat HTTPS ishlatilishi kerak.

## 📚 Qo'shimcha

### Environment Variables

- `VITE_API_BASE_URL` - Backend API URL
- `VITE_API_TIMEOUT` - Request timeout (milliseconds)
- `VITE_ENV` - Environment (development/production)

### Files Changed

- `src/pages/manager/LoginPage.tsx` - Demo ma'lumotlar olib tashlandi
- `src/store/authStore.ts` - Mock rejim olib tashlandi
- `src/lib/api.ts` - API URL yangilandi
- `.env` - API URL sozlandi

---

**Tayyor!** Endi login sahifasi faqat API orqali ishlaydi. 🚀
