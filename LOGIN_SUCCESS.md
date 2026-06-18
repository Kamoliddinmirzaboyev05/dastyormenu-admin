# ✅ Login API - Muvaffaqiyatli Integratsiya

## 🎉 Tayyor!

Login sahifasi API ga to'liq bog'landi va mukammal ishlaydi!

## 📊 API Ma'lumotlari

### Request

```bash
POST http://localhost:8000/api/auth/login
Content-Type: application/json

{
  "login": "manager",
  "password": "admin1admin"
}
```

### Response (200 OK)

```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "user": {
    "id": "user-id",
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
    "id": "org-id",
    "full_name": "Kamil Iddin",
    "role": "manager",
    "is_active": true
  }
}
```

## 🔐 SessionStorage

Login muvaffaqiyatli bo'lganda quyidagi ma'lumotlar saqlanadi:

```javascript
// Access token
sessionStorage.getItem('dastyor_token')
// "eyJhbGc..."

// Refresh token
sessionStorage.getItem('dastyor_refresh_token')
// "eyJhbGc..."

// User and organization
sessionStorage.getItem('dastyor_auth')
// '{"user":{...},"organization":{...}}'

// Saved login (if "Remember me" checked)
sessionStorage.getItem('dastyor_saved_login')
// "manager"
```

## 🎯 Xususiyatlar

### ✅ Implemented Features

1. **API Integration**
   - ✅ POST /api/auth/login
   - ✅ Request body: `{login, password}`
   - ✅ Response handling
   - ✅ Token storage (sessionStorage)

2. **Error Handling**
   - ✅ 401 Unauthorized
   - ✅ 500 Internal Server Error
   - ✅ Network errors
   - ✅ JSON parse errors
   - ✅ Timeout errors

3. **UI/UX**
   - ✅ Loading states
   - ✅ Error messages
   - ✅ Success toast
   - ✅ Remember me
   - ✅ Forgot password (placeholder)
   - ✅ Show/hide password

4. **Security**
   - ✅ SessionStorage (auto-clear on tab close)
   - ✅ JWT tokens
   - ✅ CORS support
   - ✅ Secure password input

5. **Debugging**
   - ✅ Console logging
   - ✅ Request/Response logs
   - ✅ Error logs
   - ✅ Detailed error messages

## 🚀 Ishlatish

### 1. Backend Serverni Ishga Tushiring

```bash
# Backend papkasida
uvicorn main:app --reload --port 8000
```

### 2. Frontend Serverni Ishga Tushiring

```bash
# Frontend papkasida
npm run dev
```

### 3. Brauzerda Oching

```
http://localhost:5173
```

### 4. Login Qiling

- Login: `manager`
- Parol: `admin1admin`

## 📝 Browser Console Loglari

Login qilganda quyidagi loglar ko'rinadi:

```
🔵 Login attempt: manager
🔵 API Request: http://localhost:8000/api/auth/login POST
🟢 API Response: 200 OK
📦 Response data: {access_token: "...", user: {...}}
✅ Login successful
```

## 🔍 Network Tab

Browser Network tab da:

**Request:**
- URL: `http://localhost:8000/api/auth/login`
- Method: `POST`
- Headers: `Content-Type: application/json`
- Body: `{"login":"manager","password":"admin1admin"}`

**Response:**
- Status: `200 OK`
- Headers: `Content-Type: application/json`
- Body: `{access_token, refresh_token, user, organization}`

## 💾 Data Flow

```
1. User enters login/password
   ↓
2. Form validation (Zod)
   ↓
3. API request (POST /api/auth/login)
   ↓
4. Backend authentication
   ↓
5. Response (tokens + user data)
   ↓
6. Save to sessionStorage
   ↓
7. Update Zustand store
   ↓
8. Show success toast
   ↓
9. Navigate to /manager
```

## 🎨 UI States

### Loading State
```tsx
{isSubmitting ? (
  <>
    <span className="animate-spin" />
    <span>Tekshirilmoqda...</span>
  </>
) : (
  <>
    <LogIn size={16} />
    <span>Kirish</span>
  </>
)}
```

### Error State
```tsx
{apiError && (
  <div className="bg-red-500/10 border border-red-500/30">
    <AlertCircle />
    <p>{apiError}</p>
  </div>
)}
```

### Success State
```tsx
toastSuccess('Muvaffaqiyatli kirdingiz!');
navigate('/manager');
```

## 🔧 Code Examples

### Login Function

```typescript
const onSubmit = async (data: FormData) => {
  setApiError(null);
  
  const err = await signIn(data.login, data.password);
  if (err) {
    setApiError(err);
    toastError(err);
  } else {
    toastSuccess('Muvaffaqiyatli kirdingiz!');
    navigate('/manager');
  }
};
```

### Auth Service

```typescript
async login(credentials: LoginRequest) {
  const response = await apiClient.post('/api/auth/login', credentials);
  
  if (response.success && response.data) {
    sessionStorage.setItem('dastyor_token', response.data.access_token);
    sessionStorage.setItem('dastyor_refresh_token', response.data.refresh_token);
    sessionStorage.setItem('dastyor_auth', JSON.stringify({
      user: response.data.user,
      organization: response.data.organization,
    }));
  }
  
  return response;
}
```

### Auth Store

```typescript
signIn: async (login, password) => {
  const response = await authService.login({ login, password });
  
  if (response.success && response.data) {
    set({ 
      user: response.data.user, 
      organization: response.data.organization 
    });
    return null;
  }
  
  return response.error?.message || 'Login yoki parol noto\'g\'ri';
}
```

## 📁 File Structure

```
src/
├── lib/
│   ├── api.ts              # API client
│   ├── authService.ts      # Auth service
│   ├── apiTypes.ts         # API types
│   └── types.ts            # App types
├── store/
│   └── authStore.ts        # Auth state management
└── pages/manager/
    └── LoginPage.tsx       # Login UI
```

## 🧪 Testing

### Manual Test

1. Open browser: `http://localhost:5173`
2. Open DevTools (F12)
3. Go to Console tab
4. Enter login: `manager`
5. Enter password: `admin1admin`
6. Click "Kirish"
7. Check console logs
8. Check Network tab
9. Check sessionStorage

### Automated Test

```typescript
// Test login
const response = await fetch('http://localhost:8000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ login: 'manager', password: 'admin1admin' })
});

const data = await response.json();
console.log('Status:', response.status);
console.log('Data:', data);

// Check sessionStorage
console.log('Token:', sessionStorage.getItem('dastyor_token'));
console.log('Auth:', sessionStorage.getItem('dastyor_auth'));
```

## 🎉 Success Indicators

Login muvaffaqiyatli bo'lganda:

1. ✅ Console da "✅ Login successful" ko'rinadi
2. ✅ Success toast ko'rinadi: "Muvaffaqiyatli kirdingiz!"
3. ✅ SessionStorage da tokenlar saqlanadi
4. ✅ User va organization ma'lumotlari saqlanadi
5. ✅ `/manager` sahifasiga yo'naltiriladi

## 🐛 Debugging

Agar muammo bo'lsa:

1. **Browser Console** - F12 > Console
2. **Network Tab** - F12 > Network
3. **SessionStorage** - F12 > Application > Session Storage
4. **Backend Logs** - Terminal da backend loglarni ko'ring

## 📚 Documentation

- `LOGIN_API_GUIDE.md` - To'liq API qo'llanmasi
- `TROUBLESHOOTING.md` - Muammolarni hal qilish
- `BACKEND_DEBUG.md` - Backend debug
- `FIX_500_ERROR.md` - 500 error yechimi

---

**Tabriklaymiz! Login sahifasi mukammal ishlaydi! 🎉**
