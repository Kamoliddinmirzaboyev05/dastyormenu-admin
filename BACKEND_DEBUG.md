# 🔧 Backend 500 Error - Debug Qo'llanmasi

## ❌ Muammo: 500 Internal Server Error

Server ishlayapti lekin login qilishda 500 xatosi qaytaryapti.

## 🔍 Xatolikni Topish

### 1. Backend Loglarni Ko'ring

Backend server terminalida xatolarni ko'ring:

```bash
# Backend papkasida
uvicorn main:app --reload --log-level debug
```

Quyidagi xatolar bo'lishi mumkin:
- Database connection error
- Missing environment variables
- Import errors
- Validation errors
- Authentication errors

### 2. Browser Console ni Tekshiring

Browser da F12 bosing va Console tab ni oching:

```
🔵 API Request: http://localhost:8000/api/auth/login POST
🟢 API Response: 500 Internal Server Error
❌ API Error Response: {status: 500, data: {...}}
📦 Response data: {detail: "..."}
```

### 3. Network Tab ni Tekshiring

Browser da F12 > Network tab:
1. `/api/auth/login` requestni toping
2. Response tab ni oching
3. Xato ma'lumotlarini ko'ring

## 🛠️ Keng Tarqalgan Xatolar va Yechimlar

### 1. Database Connection Error

**Xato:**
```
sqlalchemy.exc.OperationalError: (psycopg2.OperationalError) 
could not connect to server
```

**Yechim:**
```bash
# PostgreSQL serverni ishga tushiring
sudo service postgresql start

# Yoki Docker
docker-compose up -d postgres
```

### 2. Missing Environment Variables

**Xato:**
```
KeyError: 'DATABASE_URL'
KeyError: 'SECRET_KEY'
```

**Yechim:**

`.env` faylini yarating:
```env
DATABASE_URL=postgresql://user:password@localhost/dbname
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 3. User Not Found

**Xato:**
```
User not found in database
```

**Yechim:**

Database da user yarating:
```python
# create_user.py
from app.database import SessionLocal
from app.models import User
from app.auth import get_password_hash

db = SessionLocal()

user = User(
    username="manager",
    email="manager@example.com",
    hashed_password=get_password_hash("admin1admin"),
    role="manager",
    is_active=True
)

db.add(user)
db.commit()
print("User created successfully!")
```

### 4. Password Hashing Error

**Xato:**
```
ValueError: Invalid salt
AttributeError: 'NoneType' object has no attribute 'verify'
```

**Yechim:**

Password hashing to'g'ri ishlayotganini tekshiring:
```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Hash password
hashed = pwd_context.hash("admin1admin")
print(f"Hashed: {hashed}")

# Verify password
is_valid = pwd_context.verify("admin1admin", hashed)
print(f"Valid: {is_valid}")
```

### 5. Import Error

**Xato:**
```
ImportError: cannot import name 'User' from 'app.models'
ModuleNotFoundError: No module named 'app'
```

**Yechim:**
```bash
# Virtual environment yarating
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Dependencies o'rnating
pip install -r requirements.txt
```

### 6. CORS Error (Backend)

**Xato:**
```
Access to fetch at 'http://localhost:8000/api/auth/login' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Yechim:**

`main.py` da CORS qo'shing:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📝 Backend Code Namunasi

### Minimal Working Example

```python
# main.py
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = "your-secret-key-here"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Models
class LoginRequest(BaseModel):
    login: str
    password: str

class User(BaseModel):
    id: str
    username: str
    email: str
    role: str
    is_active: bool

class Organization(BaseModel):
    id: str
    full_name: str
    role: str
    is_active: bool

# Mock database
USERS = {
    "manager": {
        "id": "user-1",
        "username": "manager",
        "email": "manager@example.com",
        "hashed_password": pwd_context.hash("admin1admin"),
        "role": "manager",
        "is_active": True
    }
}

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@app.post("/api/auth/login")
async def login(request: LoginRequest):
    try:
        # Find user
        user_data = USERS.get(request.login)
        
        if not user_data:
            raise HTTPException(status_code=401, detail="Incorrect username or password")
        
        # Verify password
        if not pwd_context.verify(request.password, user_data["hashed_password"]):
            raise HTTPException(status_code=401, detail="Incorrect username or password")
        
        # Create tokens
        access_token = create_access_token({"sub": user_data["username"]})
        refresh_token = create_access_token({"sub": user_data["username"]})
        
        # Return response
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": {
                "id": user_data["id"],
                "username": user_data["username"],
                "email": user_data["email"],
                "role": user_data["role"],
                "is_active": user_data["is_active"],
                "first_name": "",
                "last_name": "",
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
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "Backend server is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### Requirements.txt

```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
pydantic==2.5.0
```

## 🧪 Test Qilish

### 1. Backend Test

```bash
# Server ishga tushiring
uvicorn main:app --reload --port 8000

# Boshqa terminalda test qiling
curl http://localhost:8000
# Response: {"message": "Backend server is running"}
```

### 2. Login Test

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"manager","password":"admin1admin"}'
```

**Expected Response:**
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "user": {...},
  "organization": {...}
}
```

### 3. Python Test

```python
import requests

response = requests.post(
    "http://localhost:8000/api/auth/login",
    json={"login": "manager", "password": "admin1admin"}
)

print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")
```

## 📋 Debug Checklist

Backend tarafda:
- [ ] Server ishlab turibdi (port 8000)
- [ ] CORS yoqilgan
- [ ] Database ulanishi ishlayapti
- [ ] Environment variables sozlangan
- [ ] User database da mavjud
- [ ] Password to'g'ri hash qilingan
- [ ] JWT secret key sozlangan
- [ ] Dependencies o'rnatilgan

Frontend tarafda:
- [ ] `.env` fayli to'g'ri
- [ ] API URL to'g'ri
- [ ] Browser console da loglar ko'rinadi
- [ ] Network tab da request ko'rinadi

## 🔍 Qo'shimcha Debug

### Backend Loglarni Yoqish

```python
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@app.post("/api/auth/login")
async def login(request: LoginRequest):
    logger.debug(f"Login attempt: {request.login}")
    try:
        # ... your code
        logger.debug("Login successful")
    except Exception as e:
        logger.error(f"Login error: {e}", exc_info=True)
        raise
```

### Request/Response Middleware

```python
@app.middleware("http")
async def log_requests(request: Request, call_next):
    print(f"Request: {request.method} {request.url}")
    body = await request.body()
    print(f"Body: {body.decode()}")
    
    response = await call_next(request)
    
    print(f"Response: {response.status_code}")
    return response
```

## 💡 Maslahatlar

1. **Backend loglarni doim ko'ring** - Xatolar terminalda ko'rinadi
2. **Database connection ni tekshiring** - Ko'p xatolar database bilan bog'liq
3. **Environment variables ni tekshiring** - `.env` fayli to'g'ri sozlangan bo'lishi kerak
4. **Dependencies ni yangilang** - `pip install -r requirements.txt`
5. **Virtual environment ishlatilsin** - Dependency conflicts oldini olish uchun

---

**Omad! 🚀**
