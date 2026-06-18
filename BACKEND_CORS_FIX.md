# Backend CORS Muammosini Hal Qilish

## Muammo
```
Access to fetch at 'https://dastyormenu-backend-production.up.railway.app/api/menu/' 
from origin 'http://localhost:5176' has been blocked by CORS policy
```

## Yechim: Backend'da CORS Sozlamalarini Yangilash

### Django Backend (settings.py)

```python
# settings.py

# CORS sozlamalari
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://localhost:3000",
    "https://your-frontend-domain.vercel.app",  # Production domain
]

# Yoki development uchun barcha originlarni ruxsat etish
CORS_ALLOW_ALL_ORIGINS = True  # Faqat development uchun!

# CORS headers
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]
```

### FastAPI Backend (main.py)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:3000",
        "https://your-frontend-domain.vercel.app",
    ],
    # Yoki development uchun
    # allow_origins=["*"],  # Faqat development uchun!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Railway.app'da O'zgartirish

1. Railway dashboard'ga kiring
2. Backend service'ni tanlang
3. Settings > Environment Variables
4. Quyidagi o'zgaruvchilarni qo'shing:

```
CORS_ALLOWED_ORIGINS=http://localhost:5176,http://localhost:5173,https://your-frontend.vercel.app
```

4. Backend'ni qayta deploy qiling

## Yechim 2: Vaqtinchalik - Proxy Ishlatish

Agar backend'ni o'zgartira olmasangiz, vite.config.ts'da proxy qo'shing:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://dastyormenu-backend-production.up.railway.app',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
```

Keyin .env'da:
```
VITE_API_BASE_URL=
```

## Yechim 3: Backend Adminiga Murojaat Qiling

Agar backend sizniki bo'lmasa, backend adminiga quyidagilarni ayting:

**Subject:** CORS Issue - Frontend Cannot Access API

**Message:**
```
Salom,

Frontend'dan API'ga so'rov yuborishda CORS xatoligi yuz berayapti:

Origin: http://localhost:5176
API: https://dastyormenu-backend-production.up.railway.app/api/menu/

Iltimos, backend CORS sozlamalarida quyidagi originlarni ruxsat eting:
- http://localhost:5173
- http://localhost:5174
- http://localhost:5175
- http://localhost:5176
- https://[production-domain].vercel.app

Rahmat!
```

## Tezkor Test

Backend CORS to'g'ri sozlanganini tekshirish:

```bash
curl -H "Origin: http://localhost:5176" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS \
  https://dastyormenu-backend-production.up.railway.app/api/menu/
```

Kutilayotgan javob:
```
Access-Control-Allow-Origin: http://localhost:5176
Access-Control-Allow-Methods: POST, GET, OPTIONS, ...
```

## Production Deploy

Production'da frontend domain'ni ham qo'shishni unutmang:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5176",
    "https://dastyormenu.vercel.app",  # Production domain
]
```
