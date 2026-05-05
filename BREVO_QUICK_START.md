# 📧 Brevo Quick Start

## 🚀 5-Minute Setup

### 1. Sign Up
Go to: https://app.brevo.com/account/register

### 2. Create API Key
1. Go to: https://app.brevo.com/settings/keys/api
2. Click "Generate a new API key"
3. Name: `NHIS Booking App`
4. Copy the API key (starts with `xkeysib-`)

### 3. Verify Sender
1. Go to: https://app.brevo.com/senders
2. Click "Add a new sender"
3. Enter your email and name
4. Check email and click verification link

### 4. Update `.env`
```env
BREVO_API_KEY=xkeysib-your-api-key-here
EMAIL_FROM=your-verified-email@example.com
EMAIL_FROM_NAME=NHIS Appointment System
```

### 5. Test
```bash
node test-email.js your-email@example.com
```

---

## ✅ That's It!

Your app now uses Brevo for professional email delivery.

**Benefits:**
- ✅ 300 emails/day free (3x more than SendGrid)
- ✅ Better deliverability
- ✅ Email analytics
- ✅ No credit card required

**Check Emails:**
https://app.brevo.com/statistics/email

---

## 🔄 Fallback to SMTP

If Brevo is not configured, the app automatically falls back to SMTP (Gmail, Outlook, etc.).

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

See `BREVO_SETUP_GUIDE.md` for complete documentation.

---

**Ready to send!** 🎉
