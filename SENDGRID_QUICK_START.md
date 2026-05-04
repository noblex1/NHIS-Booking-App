# 📧 SendGrid Quick Start

## 🚀 5-Minute Setup

### 1. Sign Up
Go to: https://signup.sendgrid.com/

### 2. Create API Key
1. Go to: https://app.sendgrid.com/settings/api_keys
2. Click "Create API Key"
3. Name: `NHIS Booking App`
4. Permission: **Full Access**
5. Copy the API key (starts with `SG.`)

### 3. Verify Sender
1. Go to: https://app.sendgrid.com/settings/sender_auth/senders
2. Click "Create New Sender"
3. Enter your email and details
4. Check email and click verification link

### 4. Update `.env`
```env
SENDGRID_API_KEY=SG.your-api-key-here
EMAIL_FROM=your-verified-email@example.com
EMAIL_FROM_NAME=NHIS Appointment System
```

### 5. Test
```bash
node test-email.js your-email@example.com
```

---

## ✅ That's It!

Your app now uses SendGrid for professional email delivery.

**Benefits:**
- ✅ 100 emails/day free
- ✅ Better deliverability
- ✅ Email analytics
- ✅ No App Passwords needed

**Check Emails:**
https://app.sendgrid.com/email_activity

---

## 🔄 Fallback to SMTP

If SendGrid is not configured, the app automatically falls back to SMTP (Gmail, Outlook, etc.).

Just keep your SMTP settings in `.env` as backup:
```env
# SMTP Fallback (optional)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
```

---

## 📚 Full Guide

See `SENDGRID_SETUP_GUIDE.md` for complete documentation.

---

**Ready to send!** 🎉
