# 🚀 Complete Setup & Testing Guide

## Overview

This guide will walk you through setting up Brevo credentials, testing the backend, and testing the frontend integration.

---

## Part 1: Brevo Setup (5-10 minutes)

### Step 1: Create Brevo Account

1. Visit: https://www.brevo.com
2. Click "Sign up free"
3. Fill in your details:
   - Email address
   - Password
   - Company name (can be "NHIS Appointment System")
4. Click "Create my account"

### Step 2: Verify Your Email

1. Check your email inbox
2. Open the verification email from Brevo
3. Click the verification link
4. Complete any additional setup steps

### Step 3: Get SMTP Credentials

1. Login to Brevo dashboard
2. Click your profile icon (top right)
3. Go to: **Settings** → **SMTP & API**
4. In the **SMTP** section, you'll see:
   ```
   SMTP server: smtp-relay.brevo.com
   Port: 587
   Login: your-email@example.com
   ```
5. Click **"Generate a new SMTP key"**
6. Give it a name: `NHIS Backend`
7. **IMPORTANT:** Copy the key immediately (you won't see it again!)
8. Save it somewhere safe

### Step 4: Configure Backend

1. Open `.env` file in the root directory
2. Update these lines:
   ```env
   BREVO_SMTP_USER=your-brevo-email@example.com
   BREVO_SMTP_PASS=your-smtp-key-here
   ```
3. Save the file

**Alternative:** Run the interactive setup script:
```bash
node setup-brevo.js
```

---

## Part 2: Test Backend (5 minutes)

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Test Email Service

```bash
node test-email.js your-email@example.com
```

**Expected output:**
```
🧪 Testing Brevo Email Service

📧 Test 1: Sending OTP email...
✅ OTP email sent successfully!

📧 Test 2: Sending appointment confirmation email...
✅ Appointment confirmation email sent successfully!

🎉 All tests passed!
```

**Check your email:**
- You should receive 2 emails
- One with an OTP code
- One with appointment confirmation
- Check spam folder if not in inbox

### Step 3: Start Backend Server

```bash
npm run dev
```

**Expected output:**
```
NHIS backend running on port 5000
```

### Step 4: Test Health Endpoint

Open a new terminal and run:

```bash
curl http://localhost:5000/health
```

**Expected response:**
```json
{
  "success": true,
  "message": "NHIS Appointment Booking API is healthy",
  "timestamp": "2026-04-26T..."
}
```

### Step 5: Test Registration API

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "dateOfBirth": "1990-01-01",
    "email": "your-email@example.com"
  }'
```

**Expected response:**
```json
{
  "success": true,
  "message": "OTP sent to your email"
}
```

**Check your email** for the OTP code!

### Step 6: Test OTP Verification

Replace `123456` with the actual OTP from your email:

```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "otpCode": "123456"
  }'
```

**Expected response:**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "fullName": "Test User",
    "email": "your-email@example.com",
    "nhisNumber": "NHIS-123456",
    "dateOfBirth": "1990-01-01T00:00:00.000Z",
    "isVerified": true
  }
}
```

**✅ Backend is working!**

---

## Part 3: Test Frontend (10 minutes)

### Step 1: Install Frontend Dependencies

```bash
cd client
npm install
```

### Step 2: Configure Frontend

Check `client/.env` file:
```env
VITE_API_BASE_URL=http://localhost:5000
```

### Step 3: Start Frontend

```bash
npm run dev
```

**Expected output:**
```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 4: Open Browser

Open: http://localhost:5173

### Step 5: Test Registration Flow

1. **Click "Register"** or go to http://localhost:5173/register

2. **Fill in the form:**
   - Full Name: `John Doe`
   - Date of Birth: `1990-01-01`
   - Email: `your-email@example.com` (use a real email)

3. **Click "Send Verification Code"**

4. **Expected:**
   - Success toast appears
   - Redirected to verify page
   - Email received with OTP

5. **Check your email** and copy the 6-digit code

6. **Enter the OTP** on the verify page

7. **Expected:**
   - Success toast with NHIS number
   - Redirected to dashboard
   - You're logged in!

### Step 6: Test Logout & Login

1. **Logout** (if there's a logout button, or clear localStorage)

2. **Go to Login page:** http://localhost:5173/login

3. **Fill in the form:**
   - NHIS Number: (from registration, e.g., `NHIS-123456`)
   - Date of Birth: `1990-01-01`

4. **Click "Login"**

5. **Expected:**
   - Success toast: "Welcome back!"
   - Redirected to dashboard
   - You're logged in!

### Step 7: Test Error Handling

#### Test Invalid Email
1. Go to register page
2. Enter invalid email: `notanemail`
3. Try to submit
4. **Expected:** Validation error shown

#### Test Duplicate Email
1. Try to register with the same email again
2. **Expected:** Error toast: "User already exists. Please login."

#### Test Invalid OTP
1. Start registration
2. Enter wrong OTP code: `000000`
3. **Expected:** Error toast: "Invalid or expired OTP"

#### Test Resend OTP
1. On verify page, wait for timer to reach 0
2. Click "Resend code"
3. **Expected:** New email received, timer resets

**✅ Frontend is working!**

---

## Part 4: Full Integration Test

### Complete User Journey

1. **Register:**
   - Go to http://localhost:5173/register
   - Enter your details with a real email
   - Submit form
   - Check email for OTP
   - Verify OTP
   - Get NHIS number

2. **Logout:**
   - Clear localStorage or use logout button
   - Go to login page

3. **Login:**
   - Enter NHIS number and DOB
   - Login successfully
   - Access dashboard

4. **Book Appointment** (if implemented):
   - Go to book page
   - Select date and time
   - Book appointment
   - Check email for confirmation

---

## 🐛 Troubleshooting

### Backend Issues

#### "Email not sending"
```bash
# Test email service
node test-email.js your-email@example.com

# Check backend logs for errors
# Verify Brevo credentials in .env
```

#### "MongoDB connection error"
```bash
# Check if MongoDB is running
# For local: net start MongoDB (Windows) or sudo systemctl start mongod (Linux)
# For Atlas: Check connection string in .env
```

#### "Port 5000 already in use"
```bash
# Change PORT in .env to 5001
# Or kill the process using port 5000
```

### Frontend Issues

#### "Network error"
```bash
# Check backend is running on port 5000
# Check VITE_API_BASE_URL in client/.env
# Check browser console for CORS errors
```

#### "OTP not received"
```bash
# Check spam/junk folder
# Check Brevo dashboard for delivery status
# Verify email address is correct
# Check backend logs for email sending errors
```

#### "Token not persisting"
```bash
# Open DevTools → Application → Local Storage
# Check for nhis_auth_token
# Clear cache and try again
```

---

## 📊 System Status Checklist

### Backend ✅
- [ ] Dependencies installed (`npm install`)
- [ ] Brevo credentials configured
- [ ] MongoDB running
- [ ] Server starts without errors
- [ ] Health endpoint responds
- [ ] Email test passes
- [ ] Registration API works
- [ ] OTP verification works

### Frontend ✅
- [ ] Dependencies installed (`cd client && npm install`)
- [ ] Environment variables configured
- [ ] Server starts without errors
- [ ] Can access http://localhost:5173
- [ ] Registration form works
- [ ] OTP verification works
- [ ] Login works
- [ ] Error handling works

### Integration ✅
- [ ] Frontend can call backend APIs
- [ ] Emails are received
- [ ] OTP verification completes
- [ ] Login persists user session
- [ ] Error messages display correctly

---

## 🎉 Success Criteria

You know everything is working when:

1. ✅ You can register with your email
2. ✅ You receive an OTP email within seconds
3. ✅ You can verify the OTP and get an NHIS number
4. ✅ You can login with NHIS number and DOB
5. ✅ You stay logged in after page refresh
6. ✅ Error messages display correctly

---

## 📚 Next Steps

Once everything is working:

1. **Update other pages:**
   - Dashboard to show user info
   - Book page to integrate appointments API
   - Appointments page to show user's bookings

2. **Add features:**
   - Logout functionality
   - Protected routes
   - Appointment cancellation
   - Email reminders

3. **Prepare for production:**
   - Update environment variables
   - Enable HTTPS
   - Configure CORS for production domain
   - Test email delivery in production

---

## 📞 Need Help?

### Documentation
- `BREVO_SETUP_GUIDE.md` - Detailed Brevo setup
- `QUICK_START.md` - Quick start guide
- `MIGRATION_GUIDE.md` - Migration details
- `FRONTEND_INTEGRATION_COMPLETE.md` - Frontend changes
- `README_BACKEND.md` - API documentation

### Test Scripts
- `node test-email.js your-email@example.com` - Test email
- `node setup-brevo.js` - Interactive Brevo setup

### Logs
- Backend logs in terminal
- Frontend logs in browser console
- Brevo logs in dashboard

---

## ✨ You're All Set!

Your NHIS Appointment System is now fully functional with:
- ✅ Email-based OTP verification
- ✅ Secure JWT authentication
- ✅ Professional email templates
- ✅ Full frontend integration
- ✅ Error handling
- ✅ Responsive design

**Happy coding! 🚀**
