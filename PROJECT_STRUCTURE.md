# 📁 Project Structure

## Correct File Locations

### Root Directory (Backend)

```
NHIS Booking App/
├── .env                          ✅ Backend environment variables (IGNORED by git)
├── .env.example                  ✅ Backend environment template (TRACKED by git)
├── .gitignore                    ✅ Root gitignore (TRACKED by git)
├── package.json                  ✅ Backend dependencies
├── server.js                     ✅ Backend entry point
├── node_modules/                 ❌ IGNORED by git
├── src/                          ✅ Backend source code
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   │   ├── email.service.js     ✅ Email service (Brevo)
│   │   └── otp.service.js       ✅ OTP service
│   └── utils/
├── test-email.js                 ✅ Email testing script
├── setup-brevo.js                ✅ Brevo setup script
└── Documentation files...
```

### Client Directory (Frontend)

```
client/
├── .env                          ✅ Frontend environment variables (IGNORED by git)
├── .env.example                  ✅ Frontend environment template (TRACKED by git)
├── .gitignore                    ✅ Client gitignore (TRACKED by git)
├── package.json                  ✅ Frontend dependencies
├── index.html                    ✅ HTML entry point
├── vite.config.ts                ✅ Vite configuration
├── node_modules/                 ❌ IGNORED by git
├── src/
│   ├── lib/
│   │   ├── api-client.ts        ✅ API client
│   │   ├── auth-store.ts        ✅ Auth state management
│   │   └── utils.ts
│   ├── routes/
│   │   ├── register.tsx         ✅ Registration page
│   │   ├── verify.tsx           ✅ OTP verification page
│   │   ├── login.tsx            ✅ Login page
│   │   └── ...
│   ├── components/
│   └── main.tsx
└── dist/                         ❌ IGNORED by git (build output)
```

---

## ✅ Environment Files

### Backend `.env` (Root Directory)

**Location:** `/.env`

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://...

JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

OTP_EXPIRY_MINUTES=5
OTP_LENGTH=6
OTP_MAX_ATTEMPTS=5

# Brevo Configuration
BREVO_SMTP_USER=your-email@example.com
BREVO_SMTP_PASS=your-brevo-api-key
EMAIL_FROM_NAME=NHIS Appointment System
```

**Status:** ✅ Correctly placed in root directory  
**Git Status:** ❌ IGNORED (not tracked)

### Frontend `.env` (Client Directory)

**Location:** `/client/.env`

```env
# Backend base URL
VITE_API_BASE_URL=http://localhost:5000
```

**Status:** ✅ Correctly placed in client directory  
**Git Status:** ❌ IGNORED (not tracked)

---

## ✅ .gitignore Files

### Root `.gitignore`

**Location:** `/.gitignore`

**Purpose:** Ignores backend files

**Key entries:**
- `.env` - Backend environment variables
- `node_modules/` - Backend dependencies
- `.vscode/` - Editor settings
- `*.log` - Log files

**Status:** ✅ Created and configured

### Client `.gitignore`

**Location:** `/client/.gitignore`

**Purpose:** Ignores frontend files

**Key entries:**
- `.env` - Frontend environment variables
- `node_modules/` - Frontend dependencies
- `dist/` - Build output
- `.tanstack/` - TanStack cache

**Status:** ✅ Already exists and configured

---

## ❌ Files Removed

The following files were in incorrect locations and have been removed:

1. ❌ `src/.env` - Removed (should be in root)
2. ❌ `src/.gitignore` - Removed (not needed in src)

---

## 📋 Git Status

### Files That Should Be Tracked

✅ `.env.example` (root)  
✅ `.env.example` (client)  
✅ `.gitignore` (root)  
✅ `.gitignore` (client)  
✅ All source code files  
✅ Documentation files  

### Files That Should NOT Be Tracked

❌ `.env` (root) - Contains secrets  
❌ `.env` (client) - May contain API URLs  
❌ `node_modules/` - Dependencies  
❌ `dist/` - Build output  
❌ `.vscode/` - Editor settings  
❌ `*.log` - Log files  

---

## 🔒 Security Notes

### Never Commit These Files:

1. **`.env`** - Contains sensitive credentials:
   - MongoDB connection string with password
   - JWT secret key
   - Brevo SMTP credentials

2. **`node_modules/`** - Large and can be regenerated

3. **`.vscode/`** - Personal editor settings

### Always Commit These Files:

1. **`.env.example`** - Template without secrets
2. **`.gitignore`** - Tells git what to ignore
3. **Source code** - All `.js`, `.ts`, `.tsx` files
4. **Documentation** - All `.md` files

---

## ✅ Verification Commands

### Check Git Status
```bash
git status
```

### Check if .env is ignored
```bash
git check-ignore .env
# Should output: .env

git check-ignore client/.env
# Should output: client/.env
```

### List all .env files
```bash
# Windows PowerShell
Get-ChildItem -Recurse -Force -Filter ".env*" | Select-Object FullName

# Expected output:
# /.env
# /.env.example
# /client/.env
# /client/.env.example
```

---

## 🎯 Quick Setup Checklist

- [x] Root `.gitignore` created
- [x] Root `.env` created (with your MongoDB credentials)
- [x] Client `.gitignore` exists
- [x] Client `.env` exists
- [x] Removed `src/.env`
- [x] Removed `src/.gitignore`
- [x] `.env` files are ignored by git
- [ ] Update root `.env` with Brevo credentials
- [ ] Test backend: `npm run dev`
- [ ] Test frontend: `cd client && npm run dev`

---

## 📝 Next Steps

1. **Add Brevo credentials** to root `.env`:
   ```bash
   node setup-brevo.js
   ```

2. **Verify git is ignoring .env**:
   ```bash
   git status
   # .env should NOT appear in the list
   ```

3. **Test the setup**:
   ```bash
   node test-email.js your-email@example.com
   ```

---

## ✅ Summary

**Correct Structure:**
- ✅ `.env` in root directory (backend config)
- ✅ `.env` in client directory (frontend config)
- ✅ `.gitignore` in root directory
- ✅ `.gitignore` in client directory
- ✅ Both `.env` files are ignored by git
- ✅ Both `.env.example` files are tracked by git

**Everything is now in the correct location! 🎉**
