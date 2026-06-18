"""
Minimal Backend Test Server
Bu server login API ni test qilish uchun
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import uvicorn

app = FastAPI(title="Dastyor Test Backend")

# CORS - MUHIM!
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Production da faqat kerakli originlar
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class LoginRequest(BaseModel):
    login: str
    password: str

# Test users
TEST_USERS = {
    "superadmin": "kamoliddin",
    "manager": "admin1admin",
    "admin": "admin123",
}

@app.get("/")
async def root():
    """Backend server ishlayotganini tekshirish"""
    return {
        "message": "✅ Backend server ishlayapti!",
        "timestamp": datetime.now().isoformat(),
        "endpoints": {
            "login": "POST /api/auth/login",
            "test_users": list(TEST_USERS.keys())
        }
    }

@app.post("/api/auth/login")
async def login(request: LoginRequest):
    """Login endpoint"""
    print(f"\n🔵 Login attempt: {request.login}")
    
    try:
        # Check if user exists
        if request.login not in TEST_USERS:
            print(f"❌ User not found: {request.login}")
            raise HTTPException(
                status_code=401,
                detail="Login yoki parol noto'g'ri"
            )
        
        # Check password
        if TEST_USERS[request.login] != request.password:
            print(f"❌ Wrong password for: {request.login}")
            raise HTTPException(
                status_code=401,
                detail="Login yoki parol noto'g'ri"
            )
        
        # Success!
        print(f"✅ Login successful: {request.login}")
        
        # Generate mock tokens
        access_token = f"mock_access_token_{request.login}_{datetime.now().timestamp()}"
        refresh_token = f"mock_refresh_token_{request.login}_{datetime.now().timestamp()}"
        
        response = {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": {
                "id": f"user-{request.login}",
                "username": request.login,
                "email": f"{request.login}@example.com",
                "first_name": request.login.capitalize(),
                "last_name": "User",
                "role": "manager",
                "is_active": True,
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            },
            "organization": {
                "id": "org-1",
                "full_name": "Test Organization",
                "role": "manager",
                "is_active": True,
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            }
        }
        
        print(f"📦 Response: {response}")
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Server xatosi: {str(e)}"
        )

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    print("\n" + "="*60)
    print("🚀 Dastyor Test Backend Server")
    print("="*60)
    print("\n📋 Test Users:")
    for username, password in TEST_USERS.items():
        print(f"   - Login: {username}, Password: {password}")
    print("\n🌐 Endpoints:")
    print("   - GET  http://localhost:8000/")
    print("   - POST http://localhost:8000/api/auth/login")
    print("   - GET  http://localhost:8000/health")
    print("\n💡 Frontend URL: http://localhost:5173")
    print("="*60 + "\n")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
