# Vercel Deploy Guide

## ✅ Barcha Xatoliklar Tuzatildi

### 1. **Tuzatilgan Muammolar**
- ✅ Supabase import-lari o'chirildi
- ✅ Case-sensitive import path-lar to'g'rilandi
- ✅ TypeScript xatoliklari yo'q
- ✅ Build muvaffaqiyatli

### 2. **Vercel Environment Variables**

Vercel dashboard-da quyidagi environment variables qo'shing:

```
VITE_API_BASE_URL=https://dastyormenu-backend-production.up.railway.app
VITE_API_TIMEOUT=30000
VITE_ENV=production
```

### 3. **Deploy Qilish**

#### Option 1: Vercel CLI
```bash
# Vercel CLI o'rnatish
npm i -g vercel

# Login qilish
vercel login

# Deploy qilish
vercel --prod
```

#### Option 2: GitHub Integration
1. GitHub-ga push qiling
2. Vercel dashboard-da repository connect qiling
3. Avtomatik deploy bo'ladi

#### Option 3: Vercel Dashboard
1. https://vercel.com/new
2. "Import Git Repository" bosing
3. Repository tanlang
4. Environment variables qo'shing
5. "Deploy" bosing

### 4. **Build Settings (Vercel Dashboard)**

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 5. **Environment Variables (Vercel Dashboard)**

```
Name: VITE_API_BASE_URL
Value: https://dastyormenu-backend-production.up.railway.app

Name: VITE_API_TIMEOUT
Value: 30000

Name: VITE_ENV
Value: production
```

### 6. **Git Commit va Push**

```bash
# Barcha o'zgarishlarni commit qiling
git add .
git commit -m "Fix: Vercel deploy issues - remove supabase imports, fix paths"
git push origin main
```

### 7. **Vercel Deploy Logs**

Agar xatolik bo'lsa, Vercel dashboard-da:
1. Deployments > Latest Deployment
2. "View Function Logs" bosing
3. Xatolikni ko'ring

### 8. **Common Issues**

#### Issue: "Could not resolve"
**Solution:** Import path-larni tekshiring, case-sensitive bo'lishi kerak

#### Issue: "Module not found"
**Solution:** File mavjudligini tekshiring, git-da track qilinganini tekshiring

#### Issue: "Environment variable not defined"
**Solution:** Vercel dashboard-da environment variables qo'shing

### 9. **Post-Deploy Checklist**

- ✅ PWA install button ishlaydi
- ✅ Login qilish mumkin
- ✅ LocalStorage saqlanadi
- ✅ Offline ishlaydi
- ✅ Service Worker ro'yxatdan o'tadi

### 10. **Test URLs**

Deploy bo'lgandan keyin:
```
Production: https://your-app.vercel.app
Preview: https://your-app-git-branch.vercel.app
```

### 11. **PWA Test**

1. Chrome-da saytni oching
2. DevTools > Application > Manifest
3. Service Worker tekshiring
4. "Add to Home Screen" tugmasini tekshiring

### 12. **Monitoring**

Vercel Analytics:
- https://vercel.com/dashboard/analytics
- Real-time traffic
- Performance metrics
- Error tracking

## 🚀 Deploy Tayyor!

Barcha xatoliklar tuzatildi. Endi Vercel-ga deploy qilishingiz mumkin!
