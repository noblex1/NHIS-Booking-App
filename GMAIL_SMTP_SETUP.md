# Gmail SMTP Setup Guide

## 🎯 Overview

This guide will help you configure Gmail SMTP for sending OTP and appointment confirmation emails in your NHIS Booking application.

---

## 📋 Prerequisites

- Gmail account
- 2-Step Verification enabled on your Google account
- Access to Google Account settings

---

## 🔧 Step-by-Step Setup

### Step 1: Enable 2-Step Verification

1. **Go to Google Account Security**
   - Visit: https://myaccount.google.com/security
   - Or go to: Google Account → Security

2. **Enable 2-Step Verification**
   - Scroll to "How you sign in to Google"
   - Click on "2-Step Verification"
   - Follow the prompts to enable it
   - You'll need your phone for verification

### Step 2: Generate App Password

1. **Go to App Passwords**
   - Visit: https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → 2-Step Verification → App passwords

2. **Create New App Password**
   - Select app: **Mail**
   - Select device: **Other (Custom name)**
   - Enter name: **NHIS Booking App**
   - Click **Generate**

3. **Copy the App Password**
   - Google will show a 16-character password
   - Example: `abcd efgh ijkl mnop`
   - **Copy this password** (you won't see it again)
   - Remove spaces when using it: `abcdefghijklmnop`

### Step 3: Update Your `.env` File

Open your `.env` file and update the SMTP configuration:

```env
# SMTP Email Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=abcdefghijklmnop
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=NHIS Appointment System
```

**Replace:**
- `your-email@gmail.com` with your actual Gmail address
- `abcdefghijklmnop` with the App Password you generated (no spaces)

### Step 4: Test the Configuration

```bash
# Check configuration
node check-email-status.js

# Test email sending
node test-email.js your-email@gmail.com
```

---

## ✅ Verification

After setup, you should see:

```
✅ OTP email sent successfully!
✅ Appointment confirmation email sent successfully!
🎉 All tests passed!
```

Check your email inbox (and spam folder) for the test emails.

---

## 🔍 Troubleshooting

### Issue 1: "Invalid login" or "Username and Password not accepted"

**Cause:** Using regular Gmail password instead of App Password

**Solution:**
1. Make sure 2-Step Verification is enabled
2. Generate a new App Password
3. Use the App Password (not your regular password)
4. Remove all spaces from the App Password

### Issue 2: "Less secure app access"

**Cause:** Google has deprecated "Less secure app access"

**Solution:**
- You **must** use App Passwords now
- Regular passwords no longer work for SMTP
- Follow Step 2 above to generate an App Password

### Issue 3: Emails going to spam

**Cause:** New sender reputation

**Solution:**
1. Check spam folder for test emails
2. Mark them as "Not Spam"
3. Add your email to contacts
4. Gmail will learn over time

### Issue 4: "Connection timeout"

**Cause:** Firewall or network blocking SMTP port

**Solution:**
1. Check if port 587 is open
2. Try using port 465 with SSL:
   ```env
   SMTP_PORT=465
   SMTP_SECURE=true
   ```
3. Check your firewall settings

### Issue 5: "Authentication failed"

**Cause:** Incorrect credentials or App Password

**Solution:**
1. Verify SMTP_USER is your full Gmail address
2. Regenerate App Password
3. Make sure there are no spaces in SMTP_PASS
4. Check for typos in .env file

---

## 📊 Gmail SMTP Settings Reference

### Standard Configuration (Recommended)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
```

### Alternative Configuration (SSL)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
```

---

## 🔐 Security Best Practices

1. **Never commit `.env` file to Git**
   - Already in `.gitignore`
   - Contains sensitive credentials

2. **Use App Passwords**
   - More secure than regular passwords
   - Can be revoked without changing main password

3. **Rotate App Passwords**
   - Generate new App Password periodically
   - Revoke old ones you're not using

4. **Limit Access**
   - Only share credentials with trusted team members
   - Use environment variables in production

---

## 🌐 Alternative SMTP Providers

If Gmail doesn't work for you, try these alternatives:

### Outlook/Office365
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

### Yahoo Mail
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```
Note: Yahoo also requires App Password

### SendGrid (Recommended for Production)
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-mailgun-username
SMTP_PASS=your-mailgun-password
```

---

## 📈 Gmail Sending Limits

### Free Gmail Account
- **500 emails per day** (rolling 24-hour period)
- **500 recipients per email**
- Limit resets after 24 hours

### Google Workspace (Paid)
- **2,000 emails per day**
- Better deliverability
- Custom domain support

**For Production:** Consider using a dedicated email service like SendGrid, Mailgun, or AWS SES for higher limits and better deliverability.

---

## 🧪 Testing Checklist

- [ ] 2-Step Verification enabled
- [ ] App Password generated
- [ ] `.env` file updated with correct credentials
- [ ] No spaces in SMTP_PASS
- [ ] SMTP_USER is full email address
- [ ] `node check-email-status.js` shows all green
- [ ] `node test-email.js` sends successfully
- [ ] Test email received in inbox (or spam)
- [ ] Backend server restarted after .env changes

---

## 🚀 Production Deployment

### Environment Variables

When deploying to production (Render, Heroku, Vercel, etc.):

1. **Don't use `.env` file in production**
2. **Set environment variables in hosting platform:**
   - Render: Dashboard → Environment → Environment Variables
   - Heroku: Settings → Config Vars
   - Vercel: Settings → Environment Variables

3. **Use production-grade email service:**
   - SendGrid (99 emails/day free)
   - Mailgun (5,000 emails/month free)
   - AWS SES (62,000 emails/month free)

### Example Production Config (SendGrid)
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=SG.your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=NHIS Appointment System
```

---

## 📞 Support

### Gmail Help
- App Passwords: https://support.google.com/accounts/answer/185833
- 2-Step Verification: https://support.google.com/accounts/answer/185839
- SMTP Settings: https://support.google.com/mail/answer/7126229

### Still Having Issues?

1. **Check Backend Logs**
   ```bash
   npm run dev
   # Look for email-related errors
   ```

2. **Verify Credentials**
   ```bash
   node check-email-status.js
   ```

3. **Test with Different Email**
   ```bash
   node test-email.js another-email@example.com
   ```

4. **Check Google Account Activity**
   - Visit: https://myaccount.google.com/notifications
   - Look for blocked sign-in attempts

---

## ✨ Success!

Once configured correctly, your application will:
- ✅ Send OTP codes during registration
- ✅ Send appointment confirmations
- ✅ Deliver emails reliably
- ✅ Work in both development and production

**Next Steps:**
1. Test the registration flow: http://localhost:5173/register
2. Check that OTP emails arrive
3. Complete the verification process
4. Book an appointment and verify confirmation email

---

## 📝 Quick Reference

```bash
# Check configuration
node check-email-status.js

# Test email sending
node test-email.js your-email@gmail.com

# Start backend
npm run dev

# Start frontend
cd client && npm run dev
```

**Gmail App Password URL:**
https://myaccount.google.com/apppasswords

**Your Configuration:**
- SMTP Host: `smtp.gmail.com`
- SMTP Port: `587`
- Security: `STARTTLS`
- User: Your Gmail address
- Pass: 16-character App Password (no spaces)
