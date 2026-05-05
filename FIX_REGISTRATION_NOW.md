# 🚀 Fix Registration Error - Quick Guide

## The Problem
Registration is failing with a 500 error because the email service can't send the OTP.

## The Solution (3 Steps)

### Step 1: Diagnose the Issue

Run this command to check your email configuration:

```bash
node diagnose-email.js
```

This will tell you exactly what's wrong.

---

### Step 2: Choose Your Fix

#### Option A: Fix Brevo (Recommended)

**If your Brevo API key is invalid:**

1. Go to: https://app.brevo.com/settings/keys/api
2. Login to your Brevo account
3. Click "Generate a new API key"
4. Name it: `NHIS Booking App`
5. Copy the key (starts with `xkeysib-`)
6. Open `.env` file
7. Replace the old key:
   ```env
   BREVO_API_KEY=xkeysib-your-new-key-here
   ```

**Verify your sender email:**

1. Go to: https://app.brevo.com/senders
2. Check if `sharifiddrisu156@gmail.com` is verified
3. If not, click "Add a new sender"
4. Enter: `sharifiddrisu156@gmail.com`
5. Check your Gmail for verification email
6. Click the verification link

#### Option B: Use Gmail SMTP (Faster)

**If you want a quick solution:**

1. Enable 2-Step Verification:
   - Go to: https://myaccount.google.com/security
   - Turn on "2-Step Verification"

2. Create App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other"
   - Name: `NHIS Booking`
   - Click "Generate"
   - Copy the 16-character password

3. Update `.env` file:
   ```env
   # Add these lines at the end
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=sharifiddrisu156@gmail.com
   SMTP_PASS=your-16-char-app-password-here
   ```

---

### Step 3: Test It

**Test email sending:**

```bash
node test-email.js sharifiddrisu156@gmail.com
```

**If successful, you'll see:**
```
✅ OTP email sent successfully!
✅ Appointment confirmation email sent successfully!
🎉 All tests passed!
```

**Then restart your backend:**

```bash
# Stop backend (Ctrl+C)
# Start again
npm run dev
```

**Try registration again:**

1. Go to: http://localhost:5173/register
2. Fill in the form
3. Click "CREATE ACCOUNT"
4. Check your email for OTP
5. Enter OTP and verify
6. ✅ Success!

---

## Quick Troubleshooting

**If test fails with "Unauthorized":**
- Your Brevo API key is invalid
- Get a new one from: https://app.brevo.com/settings/keys/api

**If test fails with "Sender not verified":**
- Verify your email at: https://app.brevo.com/senders

**If test fails with "Invalid login" (Gmail):**
- You need an App Password, not your regular Gmail password
- Get it from: https://myaccount.google.com/apppasswords

**If emails go to spam:**
- Check spam/junk folder
- Mark as "Not Spam"
- Add sender to contacts

---

## Need Help?

Run the diagnostic tool to see what's wrong:

```bash
node diagnose-email.js
```

It will tell you exactly what needs to be fixed.

---

## Summary

1. ✅ Run: `node diagnose-email.js`
2. ✅ Fix the issues it finds (Option A or B above)
3. ✅ Test: `node test-email.js sharifiddrisu156@gmail.com`
4. ✅ Restart backend: `npm run dev`
5. ✅ Try registration again

**That's it!** 🎉
