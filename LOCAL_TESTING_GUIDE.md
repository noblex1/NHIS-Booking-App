# 🧪 Local Testing Guide

## ✅ Environment Configuration

Your `.env` files are now configured for local testing by default.

---

## 🔧 Backend Configuration (`.env`)

```env
NODE_ENV=development
PORT=5000

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173

# MongoDB
MONGODB_URI=mongodb+srv://...

# JWT
JWT_SECRET=...
JWT_EXPIRES_IN=7d

# OTP
OTP_EXPIRY_MINUTES=5
OTP_LENGTH=6
OTP_MAX_ATTEMPTS=5

# SMTP Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=mrgem156@gmail.com
SMTP_PASS=vsihrtzerytkowaz
EMAIL_FROM=mrgem156@gmail.com
EMAIL_FROM_NAME=NHIS Appointment System
```

**Key Settings for Local Testing:**
- ✅ `PORT=5000` - Backend runs on http://localhost:5000
- ✅ `CLIENT_URL=http://localhost:5173` - Allows frontend CORS requests
- ✅ `NODE_ENV=development` - Development mode

---

## 💻 Frontend Configuration (`client/.env`)

```env
# Backend API Base URL
VITE_API_BASE_URL=http://localhost:5000
```

**Key Settings for Local Testing:**
- ✅ `VITE_API_BASE_URL=http://localhost:5000` - Points to local backend

---

## 🚀 Start Local Testing

### Terminal 1 - Backend
```bash
npm run dev
```

**Expected Output:**
```
[INFO] NHIS backend running on port 5000
[INFO] MongoDB connected successfully
```

**Backend URL:** http://localhost:5000

### Terminal 2 - Frontend
```bash
cd client
npm run dev
```

**Expected Output:**
```
VITE ready in XXX ms
➜  Local:   http://localhost:5173/
```

**Frontend URL:** http://localhost:5173

---

## 🧪 Test Endpoints

### Health Check
```bash
curl http://localhost:5000/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "NHIS Appointment Booking API is healthy",
  "timestamp": "2026-05-01T..."
}
```

### Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "dateOfBirth": "1990-01-01",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "OTP sent to your email"
}
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "fullName": "Test User",
    "email": "test@example.com",
    "nhisNumber": "NHIS-...",
    "isVerified": true
  }
}
```

---

## 🌐 Access URLs

### Frontend Pages
- **Home:** http://localhost:5173/
- **Login:** http://localhost:5173/login
- **Register:** http://localhost:5173/register
- **Verify OTP:** http://localhost:5173/verify
- **Dashboard:** http://localhost:5173/dashboard
- **Book Appointment:** http://localhost:5173/book
- **My Appointments:** http://localhost:5173/appointments

### Backend API Endpoints
- **Health Check:** http://localhost:5000/health
- **Register:** http://localhost:5000/api/auth/register
- **Login:** http://localhost:5000/api/auth/login
- **Verify OTP:** http://localhost:5000/api/auth/verify-otp
- **Resend OTP:** http://localhost:5000/api/auth/resend-otp
- **Get Available Slots:** http://localhost:5000/api/appointments/available?date=2026-05-15
- **Create Appointment:** http://localhost:5000/api/appointments
- **Get My Appointments:** http://localhost:5000/api/appointments

---

## 🔄 Switching Between Local and Production

### For Local Testing (Current Setup)

**Backend `.env`:**
```env
CLIENT_URL=http://localhost:5173
```

**Frontend `client/.env`:**
```env
VITE_API_BASE_URL=http://localhost:5000
```

### For Production Deployment

**Backend `.env` (or hosting platform env vars):**
```env
CLIENT_URL=https://nhis-booking-app.vercel.app
```

**Frontend `client/.env` (or Vercel env vars):**
```env
VITE_API_BASE_URL=https://nhis-booking-app.onrender.com
```

---

## 🐛 Troubleshooting

### Issue: Frontend can't connect to backend

**Check 1: Backend is running**
```bash
curl http://localhost:5000/health
```

**Check 2: Frontend env is correct**
```bash
cat client/.env
# Should show: VITE_API_BASE_URL=http://localhost:5000
```

**Check 3: CORS is configured**
```bash
# In backend .env
CLIENT_URL=http://localhost:5173
```

**Check 4: Restart frontend after env changes**
```bash
cd client
# Stop with Ctrl+C
npm run dev
```

### Issue: CORS errors in browser console

**Error:**
```
Access to fetch at 'http://localhost:5000/api/auth/login' from origin 
'http://localhost:5173' has been blocked by CORS policy
```

**Solution:**
1. Check backend `.env` has `CLIENT_URL=http://localhost:5173`
2. Restart backend server
3. Clear browser cache
4. Try again

### Issue: 404 Not Found

**Check API URL:**
- ✅ Correct: `http://localhost:5000/api/auth/login`
- ❌ Wrong: `http://localhost:5000/auth/login` (missing `/api`)
- ❌ Wrong: `http://localhost:3000/api/auth/login` (wrong port)

### Issue: Connection refused

**Possible Causes:**
1. Backend not running - Start with `npm run dev`
2. Wrong port - Check `PORT=5000` in `.env`
3. Firewall blocking - Allow port 5000

---

## 📊 Port Reference

| Service | Port | URL |
|---------|------|-----|
| Backend | 5000 | http://localhost:5000 |
| Frontend | 5173 | http://localhost:5173 |
| MongoDB (local) | 27017 | mongodb://localhost:27017 |
| MongoDB (cloud) | - | mongodb+srv://... |

---

## ✅ Quick Checklist

Before testing, ensure:

- [ ] Backend `.env` exists with `PORT=5000`
- [ ] Backend `.env` has `CLIENT_URL=http://localhost:5173`
- [ ] Frontend `client/.env` exists with `VITE_API_BASE_URL=http://localhost:5000`
- [ ] MongoDB is connected (check backend logs)
- [ ] SMTP is configured (check backend logs)
- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:5173
- [ ] Health check returns success: `curl http://localhost:5000/health`
- [ ] Can access login page: http://localhost:5173/login
- [ ] Can access register page: http://localhost:5173/register

---

## 🎯 Complete Test Flow

### 1. Start Servers
```bash
# Terminal 1
npm run dev

# Terminal 2
cd client && npm run dev
```

### 2. Test Registration
1. Go to: http://localhost:5173/register
2. Fill form:
   - Full Name: John Doe
   - Date of Birth: 1990-01-01
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
3. Click "CREATE ACCOUNT"
4. Check email for OTP
5. Enter OTP on verification page
6. Should redirect to dashboard

### 3. Test Login
1. Go to: http://localhost:5173/login
2. Enter:
   - Email: test@example.com
   - Password: password123
3. Click "SIGN IN"
4. Should redirect to dashboard

### 4. Test Appointment Booking
1. Click "Book Appointment"
2. Select date
3. Select time slot
4. Click "Book Appointment"
5. Check email for confirmation
6. View in "My Appointments"

---

## 📝 Environment Variables Summary

### Backend (`.env`)
```env
# Server
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb+srv://...

# Authentication
JWT_SECRET=...
JWT_EXPIRES_IN=7d

# OTP
OTP_EXPIRY_MINUTES=5
OTP_LENGTH=6
OTP_MAX_ATTEMPTS=5

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=NHIS Appointment System
```

### Frontend (`client/.env`)
```env
# API
VITE_API_BASE_URL=http://localhost:5000
```

---

## 🚀 You're Ready!

Your environment is configured for local testing. Just run:

```bash
# Terminal 1
npm run dev

# Terminal 2
cd client && npm run dev
```

Then open: **http://localhost:5173** 🎉
