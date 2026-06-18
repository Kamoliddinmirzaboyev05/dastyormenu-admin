# ⚡ 500 Error ni Tuzatish - Tezkor Qo'llanma

## 🎯 Muammo

Server ishlayapti lekin login qilishda **500 Internal Server Error** qaytaryapti.

## 🔍 Xatolikni Topish (3 daqiqa)

### 1. Browser Console ni Oching

**F12** bosing va quyidagi loglarni ko'ring:

```
🔵 API Request: http://localhost:8000/api/auth/login POST
🟢 API Response: 500 Internal Server Error
❌ API Error Response: {status: 500, data: {...}}
```

### 2. Backend Loglarni Ko'ring

Backend terminal oynasida xatolarni ko'ring. Quyidagi xatolardan biri bo'lishi mumkin:

#### A) Database Error
```
sqlalchemy.exc.OperationalError: could not connect to server
```

**Yechim:**
```bash
# PostgreSQL ishga tushiring
sudo service postgresql start
```

#### B) User Not Found
```
User not found in database
```

**Yechim:** Database da user yarating (pastda ko'rsatilgan)

#### C) Password Error
```
ValueError: Invalid salt
```

**Yechim:** Password hashing to'g'ri sozlang (pastda ko'rsatilgan)

#### D) Missing Environment Variables
```
KeyError: 'SECRET_KEY'
```

**Yechim:** `.env` faylini yarating (pastda ko'rsatilgan)

## 🛠️ Tezkor Yechimlar

### Yechim 1: Minimal Backend Yaratish

Agar backend murakkab bo'lsa, minimal versiyani test qiling:

**1. `test_backend.py` yarating:**

```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Password
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT
SECRET_KEY = "test-secret-key-12345"
ALGORITHM = "HS256"

class LoginRequest(BaseModel):
    login: str
    password: str

# Mock user
MOCK_USER = {
    "username": "manager",
    "password_hash": pwd_context.hash("admin1admin")
}

@app.post("/api/auth/login")
async def login(request: LoginRequest):
    try:
        # Check username
        if request.login != MOCK_USER["username"]:
            raise HTTPException(status_code=401, detail="Login noto'g'ri")
        
        # Check password
        if not pwd_context.verify(request.password, MOCK_USER["password_hash"]):
            raise HTTPException(status_code=401, detail="Parol noto'g'ri")
        
        # Create token
        token_data = {"sub": request.login}
        expire = datetime.utcnow() + timedelta(minutes=30)
        token_data.update({"exp": expire})
        access_token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
        
        return {
            "access_token": access_token,
            "refresh_token": access_token,
            "user": {
                "id": "user-1",
                "username": "manager",
                "email": "manager@example.com",
                "role": "manager",
                "is_active": True,
                "first_name": "Manager",
                "last_name": "User",
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            },
            "organization": {
                "id": "org-1",
                "full_name": "Test Organization",
                "role": "manager",
                "is_active": True
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "Test backend is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug")
```

**2. Dependencies o'rnating:**

```bash
pip install fastapi uvicorn python-jose[cryptography] passlib[bcrypt]
```

**3. Ishga tushiring:**

```bash
python test_backend.py
```

**4. Test qiling:**

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"manager","password":"admin1admin"}'
```

### Yechim 2: Backend Loglarni Yoqish

Hozirgi backend da debug logging qo'shing:

```python
import logging
import traceback

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@app.post("/api/auth/login")
async def login(request: LoginRequest):
    logger.debug(f"Login attempt: {request.login}")
    try:
        # ... your code
        logger.debug("Login successful")
        return response
    except Exception as e:
        logger.error(f"Login error: {e}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
```

### Yechim 3: Database Muammosini Hal Qilish

Agar database bilan muammo bo'lsa:

```python
# Database connection test
try:
    db = SessionLocal()
    db.execute("SELECT 1")
    print("✅ Database connected")
except Exception as e:
    print(f"❌ Database error: {e}")
```

## 📋 Tezkor Checklist

Backend:
- [ ] Server ishlab turibdi: `curl http://localhost:8000`
- [ ] CORS yoqilgan
- [ ] Dependencies o'rnatilgan: `pip install -r requirements.txt`
- [ ] Environment variables sozlangan
- [ ] Database ulanishi ishlayapti
- [ ] User mavjud yoki mock user ishlatilmoqda

Frontend:
- [ ] `.env` fayli to'g'ri: `VITE_API_BASE_URL=http://localhost:8000`
- [ ] Browser console da loglar ko'rinadi
- [ ] Network tab da request/response ko'rinadi

## 🧪 Test Qilish

### 1. Backend Test

```bash
# Root endpoint
curl http://localhost:8000
# Expected: {"message": "..."}

# Login endpoint
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"manager","password":"admin1admin"}'
# Expected: {"access_token": "...", "user": {...}}
```

### 2. Frontend Test

1. Browser oching: `http://localhost:5173`
2. F12 bosing (Console)
3. Login qiling
4. Console da loglarni ko'ring

## 💡 Qo'shimcha Yordam

Agar muammo hal bo'lmasa:

1. **Backend loglarni screenshot qiling**
2. **Browser console ni screenshot qiling**
3. **Network tab ni screenshot qiling**
4. **`BACKEND_DEBUG.md` faylini o'qing** - To'liq qo'llanma

## 📞 Tezkor Yordam

Backend xatosini topish uchun:

```bash
# Backend terminalda
python -c "
import sys
print('Python version:', sys.version)

try:
    import fastapi
    print('✅ FastAPI installed:', fastapi.__version__)
except:
    print('❌ FastAPI not installed')

try:
    import passlib
    print('✅ Passlib installed')
except:
    print('❌ Passlib not installed')

try:
    import jose
    print('✅ Python-jose installed')
except:
    print('❌ Python-jose not installed')
"
```

---

**Omad! 🚀**

**Keyingi qadam:** Agar bu yechimlar ishlamasa, `BACKEND_DEBUG.md` faylini o'qing.
