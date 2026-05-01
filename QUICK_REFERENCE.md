# 🚀 Quick Reference Card

## 📍 Local URLs

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:5173 |
| **Backend** | http://localhost:5000 |
| **API Health** | http://localhost:5000/health |

---

## 🎯 Start Commands

```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

---

## 🔧 Environment Files

### Backend `.env`
```env
PORT=5000
CLIENT_URL=http://localhost:5173
VITE_API_BASE_URL=http://localhost:5000
```

### Frontend `client/.env`
```env
VITE_API_BASE_URL=http://localhost:5000
```

---

## 🌐 Frontend Pages

- Login: http://localhost:5173/login
- Register: http://localhost:5173/register
- Dashboard: http://localhost:5173/dashboard
- Book: http://localhost:5173/book
- Appointments: http://localhost:5173/appointments

---

## 🔌 API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/verify-otp` - Verify OTP code
- `POST /api/auth/resend-otp` - Resend OTP

### Appointments
- `GET /api/appointments/available?date=YYYY-MM-DD` - Get available slots
- `POST /api/appointments` - Book appointment (requires auth)
- `GET /api/appointments` - Get my appointments (requires auth)

---

## 🧪 Test Credentials

After registering, use:
```
Email: test@example.com
Password: password123
```

---

## ⚡ Quick Test

```bash
# Test backend health
curl http://localhost:5000/health

# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","dateOfBirth":"1990-01-01","email":"test@example.com","password":"password123"}'
```

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| CORS error | Check `CLIENT_URL=http://localhost:5173` in backend `.env` |
| 404 error | Check `VITE_API_BASE_URL=http://localhost:5000` in frontend `.env` |
| Connection refused | Start backend with `npm run dev` |
| Can't login | Make sure user is verified (completed OTP) |

---

## 📚 Documentation

- `LOCAL_TESTING_GUIDE.md` - Complete testing guide
- `AUTH_SYSTEM_UPDATE.md` - Authentication details
- `GMAIL_SMTP_SETUP.md` - Email configuration
- `QUICK_START_NEW_AUTH.md` - Quick start guide

---

## ✅ Ready Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Can access http://localhost:5173/login
- [ ] Can access http://localhost:5000/health
- [ ] SMTP configured for OTP emails

---

**Everything configured for local testing!** 🎉
