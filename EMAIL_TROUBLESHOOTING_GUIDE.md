# Email Delivery Troubleshooting Guide

## ✅ Test Results

**Good News:** Your backend is successfully sending emails to Brevo SMTP server!

```
✅ OTP email sent successfully
   Message ID: 890ede13-eb3e-c573-f4e2-b8022ae927d2@smtp-brevo.com

✅ Appointment confirmation email sent successfully
   Message ID: 6b17d336-54ff-7c6e-3ad5-b9d3b8760427@smtp-brevo.com
```

**The Problem:** Emails are being sent but not reaching your inbox.

---

## 🔍 Root Cause Analysis

Since the backend is successfully sending emails to Brevo, the issue is likely one of these:

### 1. **Brevo Account Not Fully Activated** (Most Likely)
- New Brevo accounts require email verification
- Sender email needs to be verified
- Account might be in sandbox mode

### 2. **Sender Email Not Verified**
- Brevo requires you to verify the sender email address
- Emails from unverified senders may be blocked

### 3. **Daily Sending Limit Reached**
- Free Brevo accounts have a 300 emails/day limit
- Check if you've exceeded this limit

### 4. **Email Blocked by Gmail**
- Gmail might be blocking emails from new/unverified Brevo accounts
- Emails might be in spam or blocked entirely

---

## 🛠️ Step-by-Step Fix

### Step 1: Verify Your Brevo Account

1. **Login to Brevo Dashboard**
   - Go to: https://app.brevo.com/
   - Login with your credentials

2. **Check Account Status**
   - Look for any warnings or notifications
   - Verify your account is fully activated

3. **Verify Sender Email**
   - Go to **Senders & IP** → **Senders**
   - Click **Add a sender**
   - Add: `a9541c001@smtp-brevo.com` or your custom domain email
   - Verify the email by clicking the link sent to your inbox

### Step 2: Check Brevo Email Logs

1. **Go to Brevo Dashboard**
   - Navigate to **Statistics** → **Email**
   - Or go to: https://app.brevo.com/statistics/email

2. **Check Recent Emails**
   - Look for emails sent to `sharifiddrisu156@gmail.com`
   - Check their status:
     - ✅ **Delivered** = Email reached Gmail
     - ⏳ **Pending** = Still being processed
     - ❌ **Bounced** = Email rejected
     - 🚫 **Blocked** = Brevo blocked the email

3. **Check Error Messages**
   - If emails show as "Bounced" or "Blocked", click for details
   - This will tell you exactly why emails aren't being delivered

### Step 3: Configure Sender Settings

Update your `.env` file to use a verified sender email:

```env
# Current configuration (using SMTP login email)
BREVO_SMTP_USER=a9541c001@smtp-brevo.com
BREVO_SMTP_PASS=<REDACTED>
EMAIL_FROM_NAME=NHIS Appointment System

# If you have a custom domain, use it instead:
# EMAIL_FROM_ADDRESS=noreply@yourdomain.com
```

### Step 4: Test with Different Email Providers

Try registering with different email addresses to isolate the issue:

```bash
# Test with different providers
node test-email.js your-outlook-email@outlook.com
node test-email.js your-yahoo-email@yahoo.com
node test-email.js another-gmail@gmail.com
```

If emails arrive at other providers but not Gmail, the issue is Gmail-specific.

---

## 🔧 Quick Fixes

### Fix 1: Use Brevo's Verified Sender

1. Go to Brevo Dashboard → **Senders & IP**
2. Add and verify a sender email
3. Update your email service to use the verified sender:

```javascript
// In src/services/email.service.js
// Change this line:
const fromEmail = process.env.BREVO_SMTP_USER || "noreply@nhis.com";

// To use a verified email:
const fromEmail = process.env.EMAIL_FROM_ADDRESS || process.env.BREVO_SMTP_USER;
```

Then add to `.env`:
```env
EMAIL_FROM_ADDRESS=your-verified-email@example.com
```

### Fix 2: Enable Brevo Sandbox Mode Testing

For testing purposes, you can use Brevo's test mode:

1. Go to Brevo Dashboard
2. Navigate to **Settings** → **SMTP & API**
3. Look for "Test mode" or "Sandbox mode"
4. Add your email as a test recipient

### Fix 3: Check Gmail Filters

1. Open Gmail
2. Go to **Settings** → **Filters and Blocked Addresses**
3. Check if any filters are blocking Brevo emails
4. Also check: **Settings** → **Forwarding and POP/IMAP**

### Fix 4: Whitelist Brevo in Gmail

1. Add `noreply@brevo.com` to your Gmail contacts
2. Search for emails from `@smtp-brevo.com` in **All Mail** (including spam)
3. If found, mark as "Not Spam"

---

## 🧪 Testing Commands

### Test 1: Send Test Email
```bash
node test-email.js sharifiddrisu156@gmail.com
```

### Test 2: Check Backend Logs
```bash
# Start backend with logging
npm run dev

# In another terminal, trigger registration
# Then check logs for email sending confirmation
```

### Test 3: Test Registration Flow
1. Start backend: `npm run dev`
2. Start frontend: `cd client && npm run dev`
3. Go to: http://localhost:5173/register
4. Register with your email
5. Check backend logs for email sending status

---

## 📊 Brevo Account Limits

### Free Plan Limits:
- **300 emails/day**
- **Unlimited contacts**
- **Sender verification required**
- **Brevo branding in emails**

### Check Your Usage:
1. Go to Brevo Dashboard
2. Navigate to **Account** → **Plan**
3. Check "Email credits used today"

---

## 🔍 Debugging Checklist

- [ ] Brevo account is fully activated
- [ ] Sender email is verified in Brevo
- [ ] Not exceeded daily sending limit (300/day)
- [ ] Checked Brevo email logs for delivery status
- [ ] Checked Gmail spam folder
- [ ] Checked Gmail "All Mail" folder
- [ ] Tested with different email providers
- [ ] Backend logs show successful email sending
- [ ] No Gmail filters blocking emails
- [ ] Brevo API credentials are correct

---

## 🚀 Recommended Solution

### Option 1: Verify Sender Email (Recommended)

1. **Add a verified sender in Brevo:**
   - Go to: https://app.brevo.com/senders
   - Click "Add a sender"
   - Use your personal email or domain email
   - Verify it by clicking the link sent to that email

2. **Update your code:**

```javascript
// src/services/email.service.js
const fromEmail = process.env.EMAIL_FROM_ADDRESS || process.env.BREVO_SMTP_USER;
```

3. **Update .env:**
```env
EMAIL_FROM_ADDRESS=your-verified-email@example.com
```

### Option 2: Use Brevo Transactional Email API (Alternative)

Instead of SMTP, use Brevo's API which has better deliverability:

```bash
npm install @sendinblue/client
```

I can help you implement this if needed.

---

## 📞 Next Steps

1. **Check Brevo Dashboard NOW:**
   - Go to: https://app.brevo.com/statistics/email
   - Look for the test emails we just sent
   - Check their delivery status

2. **Verify Sender Email:**
   - Go to: https://app.brevo.com/senders
   - Add and verify your sender email

3. **Test Again:**
   ```bash
   node test-email.js sharifiddrisu156@gmail.com
   ```

4. **Check Gmail:**
   - Inbox
   - Spam folder
   - All Mail (search for: `from:@smtp-brevo.com`)

---

## 💡 Pro Tips

1. **For Production:** Use a custom domain email (e.g., `noreply@yourdomain.com`)
2. **For Testing:** Add your email to Brevo's test recipients list
3. **Monitor Deliverability:** Check Brevo dashboard regularly
4. **Improve Deliverability:** 
   - Verify sender domain (SPF, DKIM records)
   - Use a custom domain instead of generic emails
   - Warm up your sending reputation gradually

---

## 🆘 Still Not Working?

If emails still don't arrive after following these steps:

1. **Share Brevo Dashboard Screenshot:**
   - Go to Statistics → Email
   - Take a screenshot of recent email status
   - This will show if emails are being delivered, bounced, or blocked

2. **Check Brevo Account Status:**
   - Ensure account is not suspended
   - Verify email sending is enabled

3. **Alternative Email Service:**
   - Consider using SendGrid, Mailgun, or AWS SES
   - These might have better deliverability for your use case

---

## 📝 Summary

**Current Status:**
- ✅ Backend is working correctly
- ✅ Emails are being sent to Brevo SMTP
- ❌ Emails are not reaching Gmail inbox

**Most Likely Cause:**
- Sender email not verified in Brevo
- Brevo account needs full activation
- Gmail blocking emails from unverified sender

**Immediate Action:**
1. Login to Brevo Dashboard
2. Check email logs and delivery status
3. Verify sender email
4. Test again

Let me know what you see in the Brevo dashboard!
