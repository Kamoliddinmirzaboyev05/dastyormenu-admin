# 🔐 API Integratsiya Qo'llanmasi

## 📋 Umumiy Ma'lumot

Dastyor frontend ilovasi ikkita rejimda ishlaydi:
1. **Demo rejim (Mock)** - Backend yo'q, barcha ma'lumotlar mock
2. **API rejim (Real)** - Backend bilan to'liq integratsiya

## 🚀 Sozlash

### 1. Environment o'zgaruvchilari

`.env` faylini yarating va quyidagi o'zgaruvchilarni qo'shing:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000

# Environment
VITE_ENV=development
```

### 2. API Rejimini Yoqish

Login sahifasida "Demo rejim (Mock)" tugmasini bosing va "API rejim (Real)" ga o'tkazing.

Yoki `.env` faylida:
```env
VITE_ENV=production
```

## 📡 API Endpoints

### Authentication

#### POST `/api/auth/login`
Login qilish

**Request:**
```json
{
  "login": "admin",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "3fe85f64-5717-4562-b3fc-2c963f66afa6",
    "organization_id": "org-123",
    "full_name": "Admin Adminov",
    "role": "manager",
    "username": "admin",
    "email": "admin@dastyor.uz",
    "pin_code": "",
    "is_active": true
  },
  "organization": {
    "id": "org-123",
    "name": "Dastyor Test Restoran",
    "logo_url": null,
    "address": "Toshkent sh., Chilonzor tumani",
    "phone": "+998901234567",
    "subscription_plan": "pro",
    "subscription_status": "active",
    "subscription_expires_at": "2026-05-23T10:30:00Z",
    "trial_ends_at": null,
    "monthly_price": 40000000
  }
}
```

**Response (401):**
```json
{
  "message": "Login yoki parol noto'g'ri",
  "code": "INVALID_CREDENTIALS"
}
```

#### POST `/api/auth/logout`
Logout qilish

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "Muvaffaqiyatli chiqildi"
}
```

#### POST `/api/auth/refresh`
Token yangilash

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### GET `/api/auth/me`
Joriy foydalanuvchi ma'lumotlarini olish

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "user": { ... },
  "organization": { ... }
}
```

## 🔧 Frontend Arxitektura

### API Client (`src/lib/api.ts`)

Barcha HTTP so'rovlarni boshqaradi:
- Avtomatik timeout
- Error handling
- Token boshqaruvi
- Request/Response interceptors

**Foydalanish:**
```typescript
import { apiClient } from '@/lib/api';

// GET request
const response = await apiClient.get('/users');

// POST request
const response = await apiClient.post('/users', { name: 'John' });

// PUT request
const response = await apiClient.put('/users/123', { name: 'Jane' });

// DELETE request
const response = await apiClient.delete('/users/123');
```

### Auth Service (`src/lib/authService.ts`)

Autentifikatsiya bilan bog'liq barcha operatsiyalar:
- Login
- Logout
- Token refresh
- Token storage
- Auth verification

**Foydalanish:**
```typescript
import { authService } from '@/lib/authService';

// Login
const response = await authService.login({
  login: 'admin',
  password: 'admin123'
});

// Logout
await authService.logout();

// Check if authenticated
const isAuth = authService.isAuthenticated();

// Get current token
const token = authService.getToken();

// Verify auth with API
const isValid = await authService.verifyAuth();
```

### API Interceptor (`src/lib/apiInterceptor.ts`)

Avtomatik token refresh va error handling:
- 401 xatolarni ushlaydi
- Tokenni avtomatik yangilaydi
- Failed requestlarni qayta yuboradi
- Refresh failed bo'lsa logout qiladi

### Auth Store (`src/store/authStore.ts`)

Global auth state management:
- User ma'lumotlari
- Organization ma'lumotlari
- Loading states
- Mock/API rejim almashtirish

## 🔐 Token Boshqaruvi

### Token Storage

Token `localStorage` da saqlanadi:
```typescript
localStorage.setItem('dastyor_token', token);
```

### Token Refresh

Token muddati tugaganda (401 error) avtomatik yangilanadi:
1. 401 error keladi
2. Interceptor tokenni yangilaydi
3. Original request qayta yuboriladi
4. Agar refresh failed bo'lsa, logout qilinadi

### Token Format

JWT token format:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

## 🧪 Testing

### Mock Mode

Demo rejimda test qilish:
1. Login sahifasida "Demo rejim (Mock)" ni tanlang
2. Demo credentials bilan kiring:
   - Login: `admin` yoki `admin@dastyor.uz`
   - Parol: `admin123`

### API Mode

Real API bilan test qilish:
1. Backend serverni ishga tushiring
2. `.env` faylida API URL ni sozlang
3. Login sahifasida "API rejim (Real)" ni tanlang
4. Real credentials bilan kiring

## 🐛 Error Handling

### Network Errors

```typescript
{
  success: false,
  error: {
    message: "Tarmoq xatosi",
    code: "NETWORK_ERROR"
  }
}
```

### Timeout Errors

```typescript
{
  success: false,
  error: {
    message: "So'rov vaqti tugadi",
    code: "TIMEOUT"
  }
}
```

### API Errors

```typescript
{
  success: false,
  error: {
    message: "Login yoki parol noto'g'ri",
    code: "INVALID_CREDENTIALS",
    status: 401
  }
}
```

## 📝 Backend Requirements

Backend quyidagi endpointlarni implement qilishi kerak:

1. **POST /api/auth/login** - Login
2. **POST /api/auth/logout** - Logout
3. **POST /api/auth/refresh** - Token refresh
4. **GET /api/auth/me** - Current user

### CORS Configuration

Backend CORS ni yoqishi kerak:
```javascript
// Express.js example
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### JWT Configuration

Token muddati:
- Access token: 15 daqiqa
- Refresh token: 7 kun

## 🔒 Security

### Best Practices

1. **Token Storage**: localStorage da saqlash (XSS himoyasi kerak)
2. **HTTPS**: Production da faqat HTTPS
3. **Token Expiry**: Qisqa muddatli access token
4. **Refresh Token**: Uzoq muddatli refresh token
5. **CORS**: Faqat kerakli originlarni ruxsat berish

### Environment Variables

Sensitive ma'lumotlarni `.env` faylida saqlang va `.gitignore` ga qo'shing:
```
.env
.env.local
.env.production
```

## 📚 Qo'shimcha Resurslar

- [JWT.io](https://jwt.io/) - JWT debugger
- [Postman](https://www.postman.com/) - API testing
- [React Query](https://tanstack.com/query) - Advanced data fetching (optional)

## 🆘 Yordam

Muammolar yuzaga kelsa:
1. Browser console ni tekshiring (F12)
2. Network tab da requestlarni ko'ring
3. `.env` faylini tekshiring
4. Backend server ishlab turganini tekshiring
5. CORS sozlamalarini tekshiring

---

**Omad! 🚀**
