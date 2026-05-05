# 🔧 Registration Error Fix Guide

## 🚨 Current Issue

You're getting a **500 Internal Server Error** when trying to register. This is happening because the email service is failing to send the OTP email.

---

## 🔍 Root Cause

The error is likely one of these:

1. **Brevo API Key Invalid/Expired** - The API key in `.env` might not be working
2. **Sender Email Not Verified** - `sharifiddrisu156@gmail.com` needs to be verified in Brevo
3. **Brevo Account Issue** - Account might be suspended or have issues
4. **Network/Connectivity Issue** - Can't reach Brevo API

---

## ✅ Quick Fix Options

### Option 1: Test Current Brevo Setup (Recommended First)

Run this command to test if Brevo is working:

```bash
node test-email.js sharifiddrisu156@gmail.com
```

**If it works:**
- ✅ Brevo is configured correctly
- The registration should work now
- Try registering again

**If it fails:**
- ❌ Brevo has an issue
- Follow Option 2 or 3 below

---

### Option 2: Get New Brevo API Key

Your current API key might be invalid. Get a new one:

1. **Go to Brevo Dashboard**
   - Visit: https://app.brevo.com/settings/keys/api
   - Login with your Brevo account

2. **Create New API Key**
   - Click "Generate a new API key"
   - Name: `NHIS Booking App`
   - Click "Generate"
   - **Copy the key immediately** (you can't see it again!)

3. **Update `.env` File**
   ```env
   BREVO_API_KEY=xkeysib-your-new-api-key-here
   ```

4. **Verify Sender Email**
   - Go to: https://app.brevo.com/senders
   - Make sure `sharifiddrisu156@gmail.com` is verified
   - If not verified:
     - Click "Add a new sender"
     - Enter: `sharifiddrisu156@gmail.com`
     - Name: `NHIS Appointment System`
     - Check your Gmail for verification email
     - Click the verification link

5. **Restart Backend**
   ```bash
   # Stop the backend (Ctrl+C)
   # Start it again
   npm run dev
   ```

6. **Test Again**
   ```bash
   node test-email.js sharifiddrisu156@gmail.com
   ```

---

### Option 3: Use Gmail SMTP (Quick Alternative)

If Brevo is not working, use Gmail SMTP as a fallback:

1. **Enable 2-Step Verification on Gmail**
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Create App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name: `NHIS Booking App`
   - Click "Generate"
   - **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)

3. **Update `.env` File**
   ```env
   # Keep Brevo key (it will try Brevo first, then fall back to SMTP)
   BREVO_API_KEY=your-actual-brevo-api-key-here
   EMAIL_FROM=your-verified-email@example.com
   EMAIL_FROM_NAME=NHIS Appointment System

   # Add SMTP fallback
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=sharifiddrisu156@gmail.com
   SMTP_PASS=your-16-char-app-password-here
   ```

4. **Restart Backend**
   ```bash
   npm run dev
   ```

5. **Test**
   ```bash
   node test-email.js sharifiddrisu156@gmail.com
   ```

---

## 🧪 Testing Steps

### Step 1: Test Email Service
```bash
node test-email.js sharifiddrisu156@gmail.com
```

**Expected Output (Success):**
```
🧪 Testing email service

Configuration:
  Provider: Brevo (BREVO_API_KEY set)
  From: sharifiddrisu156@gmail.com
  Test recipient: sharifiddrisu156@gmail.com

📧 Test 1: Sending OTP email...
✅ OTP email sent successfully!

📧 Test 2: Sending appointment confirmation email...
✅ Appointment confirmation email sent successfully!

🎉 All tests passed!
```

**If You See Errors:**
- Read the error message carefully
- Follow the troubleshooting steps shown
- Try Option 2 or 3 above

### Step 2: Test Registration Flow

1. **Start Backend** (if not running)
   ```bash
   npm run dev
   ```

2. **Start Frontend** (in another terminal)
   ```bash
   cd client
   npm run dev
   ```

3. **Open Browser**
   - Go to: http://localhost:5173/register

4. **Register**
   - Full Name: `Test User`
   - Date of Birth: `1990-01-01`
   - Email: `sharifiddrisu156@gmail.com`
   - Password: `test123`
   - Confirm Password: `test123`
   - Click "CREATE ACCOUNT"

5. **Check Email**
   - Check inbox for OTP email
   - Check spam/junk folder too
   - You should receive a 6-digit OTP code

6. **Verify OTP**
   - Enter the OTP code
   - Click "VERIFY"
   - You should be redirected to dashboard

---

## 🐛 Common Errors & Solutions

### Error: "Unauthorized" or "Invalid API key"

**Cause:** Brevo API key is invalid

**Solution:**
1. Get new API key from Brevo (Option 2 above)
2. Update `.env` file
3. Restart backend

### Error: "Sender email not verified"

**Cause:** Email not verified in Brevo

**Solution:**
1. Go to: https://app.brevo.com/senders
2. Verify `sharifiddrisu156@gmail.com`
3. Check Gmail for verification email
4. Click verification link

### Error: "Daily sending limit exceeded"

**Cause:** Exceeded 300 emails/day on Brevo free tier

**Solution:**
1. Wait 24 hours for limit reset
2. Or use Gmail SMTP fallback (Option 3)
3. Or upgrade Brevo plan

### Error: "Network error" or "ECONNREFUSED"

**Cause:** Can't connect to Brevo/SMTP server

**Solution:**
1. Check internet connection
2. Check if firewall is blocking
3. Try different network
4. Check Brevo status: https://status.brevo.com/

### Error: "Invalid login" (Gmail SMTP)

**Cause:** Using regular Gmail password instead of App Password

**Solution:**
1. Enable 2-Step Verification
2. Create App Password (Option 3 above)
3. Use App Password in `SMTP_PASS`

---

## 📊 Check Backend Logs

When you try to register, check the backend terminal for error messages:

**Good (Success):**
```
OTP email sent via Brevo
to: sharifiddrisu156@gmail.com
messageId: <...>
```

**Bad (Error):**
```
Brevo failed (OTP email)
to: sharifiddrisu156@gmail.com
error: {"message":"Invalid API key","code":"unauthorized"}
```

The error message will tell you exactly what's wrong.

---

## 🎯 Recommended Solution

**For Development/Testing:**
- Use **Gmail SMTP** (Option 3)
- It's easier to set up
- No need to verify sender in Brevo
- Works immediately

**For Production:**
- Use **Brevo API** (Option 2)
- Better deliverability
- Professional email service
- 300 emails/day free
- Email analytics

---

## ✅ Final Checklist

- [ ] Tested email service with `node test-email.js`
- [ ] Received test emails successfully
- [ ] Backend is running without errors
- [ ] Frontend is running
- [ ] Tried registration flow
- [ ] Received OTP email
- [ ] Verified OTP successfully
- [ ] Redirected to dashboard

---

## 🆘 Still Not Working?

If you're still having issues:

1. **Share the error message** from:
   - Backend terminal logs
   - Browser console (F12 → Console tab)
   - Test email script output

2. **Check these:**
   - Is backend running? (http://localhost:5000)
   - Is frontend running? (http://localhost:5173)
   - Are there any errors in terminal?
   - Did you restart backend after changing `.env`?

3. **Try this:**
   - Stop both backend and frontend
   - Update `.env` with correct credentials
   - Start backend: `npm run dev`
   - Start frontend: `cd client && npm run dev`
   - Test email: `node test-email.js your-email@example.com`
   - Try registration again

---

## 📚 Related Guides

- **Brevo Setup**: See `BREVO_SETUP_GUIDE.md`
- **Local Testing**: See `LOCAL_TESTING_GUIDE.md`
- **Quick Start**: See `QUICK_START_NEW_AUTH.md`

---

**Let's get your registration working!** 🚀
