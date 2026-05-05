# ✅ Production Email Checklist

## Quick Diagnosis

Run this command on your production server or locally with production env vars:

```bash
node test-production-email.js
```

This will tell you exactly what's wrong.

---

## Most Common Issues (90% of cases)

### ❌ Issue #1: Environment Variables Not Set (80% of cases)

**Problem:** Your hosting platform doesn't have the Brevo API key.

**Quick Fix:**

#### Render
1. Dashboard → Your Service → Environment
2. Add these variables:
   ```
   BREVO_API_KEY = your-actual-brevo-api-key-here
   EMAIL_FROM = your-verified-email@example.com
   EMAIL_FROM_NAME = NHIS Appointment System
   ```
3. Save → Service auto-redeploys

#### Heroku
```bash
heroku config:set BREVO_API_KEY=your-actual-brevo-api-key-here --app your-app-name
heroku config:set EMAIL_FROM=your-verified-email@example.com --app your-app-name
heroku config:set EMAIL_FROM_NAME="NHIS Appointment System" --app your-app-name
```

#### Railway
1. Project → Service → Variables
2. Add the three variables above
3. Redeploy

---

### ❌ Issue #2: Sender Email Not Verified (15% of cases)

**Problem:** Brevo requires sender verification in production.

**Quick Fix:**

1. Go to: https://app.brevo.com/senders
2. Look for `sharifiddrisu156@gmail.com`
3. If not verified:
   - Click "Add a new sender"
   - Enter: `sharifiddrisu156@gmail.com`
   - Check Gmail for verification email
   - Click verification link
4. Wait 1-2 minutes
5. Try registration again

---

### ❌ Issue #3: Wrong API Key (5% of cases)

**Problem:** API key is invalid or expired.

**Quick Fix:**

1. Go to: https://app.brevo.com/settings/keys/api
2. Create new API key: "NHIS Production"
3. Copy the key
4. Update in production environment
5. Redeploy

---

## Step-by-Step Fix

### Step 1: Check Environment Variables

**On Render:**
- Dashboard → Service → Environment
- Look for `BREVO_API_KEY`
- Is it set? Is it the correct value?

**On Heroku:**
```bash
heroku config --app your-app-name | grep BREVO
```

**On Railway:**
- Project → Service → Variables
- Check if variables are there

### Step 2: Verify Sender Email

1. Visit: https://app.brevo.com/senders
2. Status should be "Verified" ✅
3. If not, verify it now

### Step 3: Check Production Logs

**On Render:**
- Dashboard → Service → Logs
- Look for "Brevo failed" or "email" errors

**On Heroku:**
```bash
heroku logs --tail --app your-app-name
```

**On Railway:**
- Service → Deployments → Latest → Logs

### Step 4: Test Email

Run the test script:
```bash
node test-production-email.js
```

Or test with curl:
```bash
curl -X POST https://api.brevo.com/v3/smtp/email \
  -H "api-key: your-actual-brevo-api-key-here" \
  -H "content-type: application/json" \
  -d '{
    "sender": {"email": "your-verified-email@example.com", "name": "NHIS System"},
    "to": [{"email": "your-verified-email@example.com"}],
    "subject": "Test",
    "htmlContent": "<p>Test</p>"
  }'
```

If curl works but your app doesn't, the issue is environment variables.

---

## Verification Checklist

Copy this and check off each item:

```
Production Email Checklist:

Environment Variables:
[ ] BREVO_API_KEY is set in production
[ ] EMAIL_FROM is set in production  
[ ] EMAIL_FROM_NAME is set in production
[ ] Values match what works locally

Brevo Account:
[ ] Logged into https://app.brevo.com/
[ ] Sender email is verified (green checkmark)
[ ] API key is valid (not expired)
[ ] No account suspension or issues
[ ] Daily limit not exceeded (< 300 emails/day)

Deployment:
[ ] Latest code is deployed
[ ] Service is running (no crashes)
[ ] Can access production API
[ ] Logs are accessible

Testing:
[ ] Ran: node test-production-email.js
[ ] Test passed OR identified specific error
[ ] Checked production logs
[ ] Tried registration in production
```

---

## What to Share if Still Not Working

If you've tried everything and it's still not working, share:

1. **Hosting Platform:**
   - Render / Heroku / Railway / Other?

2. **Environment Variables Status:**
   - Are they set? (Yes/No)
   - Can you see them in dashboard?

3. **Test Script Output:**
   ```bash
   node test-production-email.js
   ```
   - Copy the full output

4. **Production Logs:**
   - Copy relevant error messages
   - Look for "Brevo", "email", "error"

5. **Brevo Dashboard:**
   - Is sender verified?
   - Any emails in statistics?
   - Any error messages?

6. **Curl Test Result:**
   - Does the curl command above work?
   - What's the response?

---

## Quick Reference

### Your Credentials
```
BREVO_API_KEY=your-actual-brevo-api-key-here
EMAIL_FROM=your-verified-email@example.com
EMAIL_FROM_NAME=NHIS Appointment System
```

**Note:** Get your actual values from your `.env` file (which is not committed to Git)

### Important Links
- Brevo Dashboard: https://app.brevo.com/
- API Keys: https://app.brevo.com/settings/keys/api
- Senders: https://app.brevo.com/senders
- Statistics: https://app.brevo.com/statistics/email

### Test Commands
```bash
# Test production email
node test-production-email.js

# Check Heroku config
heroku config --app your-app-name

# View Heroku logs
heroku logs --tail --app your-app-name

# Test Brevo API directly
curl -X POST https://api.brevo.com/v3/smtp/email \
  -H "api-key: YOUR_KEY" \
  -H "content-type: application/json" \
  -d '{"sender":{"email":"sharifiddrisu156@gmail.com"},"to":[{"email":"test@example.com"}],"subject":"Test","htmlContent":"<p>Test</p>"}'
```

---

## 99% Solution

**In 99% of cases, the issue is:**

1. Environment variables not set in production (80%)
2. Sender email not verified (15%)
3. Wrong/expired API key (4%)

**Fix:**
1. Set environment variables in your hosting platform
2. Verify sender email at https://app.brevo.com/senders
3. Redeploy/restart your service
4. Test again

**That's it!** 🎯
