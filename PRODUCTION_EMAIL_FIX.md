# 🚨 Production Email Not Working - Fix Guide

## Common Production Email Issues

When emails work locally but fail in production, it's usually one of these issues:

---

## 🔍 Issue #1: Environment Variables Not Set

### Problem
Your production environment (Render, Heroku, Vercel, etc.) doesn't have the Brevo API key configured.

### Solution

#### For Render:
1. Go to your Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Add these environment variables:
   ```
   BREVO_API_KEY=your-actual-brevo-api-key-here
   EMAIL_FROM=your-verified-email@example.com
   EMAIL_FROM_NAME=NHIS Appointment System
   ```
5. Click "Save Changes"
6. Service will auto-redeploy

#### For Heroku:
```bash
heroku config:set BREVO_API_KEY=your-actual-brevo-api-key-here
heroku config:set EMAIL_FROM=your-verified-email@example.com
heroku config:set EMAIL_FROM_NAME="NHIS Appointment System"
```

#### For Railway:
1. Go to your Railway project
2. Select your service
3. Go to "Variables" tab
4. Add the environment variables
5. Redeploy

#### For AWS/DigitalOcean:
Add environment variables to your deployment configuration or `.env` file on the server.

---

## 🔍 Issue #2: Sender Email Not Verified in Brevo

### Problem
Brevo requires sender email verification. Unverified senders can't send emails in production.

### Solution

1. **Go to Brevo Senders Page:**
   - Visit: https://app.brevo.com/senders

2. **Check Verification Status:**
   - Look for `sharifiddrisu156@gmail.com`
   - Status should be "Verified" (green checkmark)

3. **If Not Verified:**
   - Click "Add a new sender"
   - Enter: `sharifiddrisu156@gmail.com`
   - Name: `NHIS Appointment System`
   - Click "Add"
   - Check your Gmail for verification email
   - Click the verification link
   - Wait for verification (usually instant)

4. **Verify Status:**
   - Refresh Brevo senders page
   - Should show "Verified" status

---

## 🔍 Issue #3: Brevo API Key Invalid or Expired

### Problem
The API key might be invalid, expired, or doesn't have the right permissions.

### Solution

1. **Create New API Key:**
   - Go to: https://app.brevo.com/settings/keys/api
   - Click "Generate a new API key"
   - Name: `NHIS Booking Production`
   - Copy the key immediately

2. **Update Production Environment:**
   - Update `BREVO_API_KEY` in your production environment
   - Redeploy or restart your service

3. **Test:**
   - Try registration again
   - Check production logs

---

## 🔍 Issue #4: CORS or Network Issues

### Problem
Production server can't reach Brevo API due to firewall or network restrictions.

### Solution

1. **Check Firewall Rules:**
   - Ensure outbound HTTPS (port 443) is allowed
   - Whitelist `api.brevo.com`

2. **Check Network Logs:**
   - Look for connection errors
   - Check if requests to Brevo are timing out

3. **Test from Production Server:**
   ```bash
   # SSH into your production server
   curl -X POST https://api.brevo.com/v3/smtp/email \
     -H "accept: application/json" \
     -H "api-key: your-api-key" \
     -H "content-type: application/json" \
     -d '{"sender":{"email":"test@example.com"},"to":[{"email":"test@example.com"}],"subject":"Test","htmlContent":"Test"}'
   ```

---

## 🔍 Issue #5: Daily Sending Limit Exceeded

### Problem
Brevo free tier has 300 emails/day limit. If exceeded, emails fail.

### Solution

1. **Check Brevo Dashboard:**
   - Go to: https://app.brevo.com/statistics/email
   - Check daily usage
   - See if limit is reached

2. **Options:**
   - Wait 24 hours for limit reset
   - Upgrade to paid plan
   - Use SMTP fallback (Gmail)

---

## 🔍 Issue #6: Production Logs Not Showing Errors

### Problem
Can't see what's wrong because logs aren't accessible.

### Solution

#### For Render:
1. Go to your service dashboard
2. Click "Logs" tab
3. Look for email-related errors
4. Search for "Brevo" or "email"

#### For Heroku:
```bash
heroku logs --tail --app your-app-name
```

#### For Railway:
1. Go to your service
2. Click "Deployments"
3. Click on latest deployment
4. View logs

#### For Custom Server:
```bash
# SSH into server
pm2 logs your-app-name
# or
journalctl -u your-service-name -f
```

---

## 🧪 Testing Production Email

### Method 1: Check Production Logs

After attempting registration, check logs for:

**Success:**
```
[INFO] OTP email sent via Brevo
to: user@example.com
messageId: <...>
```

**Failure:**
```
[ERROR] Brevo failed (OTP email)
to: user@example.com
error: {"message":"...","code":"..."}
```

### Method 2: Test API Directly

Use curl or Postman to test your production API:

```bash
curl -X POST https://your-production-api.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "dateOfBirth": "1990-01-01",
    "email": "your-email@example.com",
    "password": "test123"
  }'
```

Check response and logs.

### Method 3: Add Debug Logging

Temporarily add more logging to production:

```javascript
// In src/services/email.service.js
async function deliverMail(mailOptions, logLabel) {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  
  // Add debug logging
  logger.info('Email service debug', {
    hasApiKey: !!apiKey,
    apiKeyLength: apiKey?.length,
    apiKeyPrefix: apiKey?.substring(0, 10),
    emailFrom: process.env.EMAIL_FROM,
    environment: process.env.NODE_ENV
  });
  
  // ... rest of code
}
```

---

## ✅ Production Checklist

Use this checklist to verify your production setup:

### Environment Variables
- [ ] `BREVO_API_KEY` is set in production
- [ ] `EMAIL_FROM` is set in production
- [ ] `EMAIL_FROM_NAME` is set in production
- [ ] `NODE_ENV` is set to `production`
- [ ] `CLIENT_URL` points to production frontend URL

### Brevo Configuration
- [ ] Brevo account is active
- [ ] API key is valid and not expired
- [ ] Sender email (`sharifiddrisu156@gmail.com`) is verified
- [ ] Daily sending limit not exceeded (check dashboard)
- [ ] No account suspension or issues

### Network & Server
- [ ] Production server can reach `api.brevo.com`
- [ ] Outbound HTTPS (port 443) is allowed
- [ ] No firewall blocking Brevo API
- [ ] Server has internet connectivity

### Code & Deployment
- [ ] Latest code is deployed to production
- [ ] Dependencies are installed (`npm install`)
- [ ] Service is running without errors
- [ ] Logs are accessible

### Testing
- [ ] Can access production API
- [ ] Registration endpoint responds
- [ ] Logs show email sending attempts
- [ ] No errors in production logs

---

## 🔧 Quick Fix Script

Create this file to test production email configuration:

**test-production-email.js:**
```javascript
require('dotenv').config();
const axios = require('axios');

async function testProductionEmail() {
  console.log('🧪 Testing Production Email Configuration\n');
  
  // Check environment variables
  console.log('Environment Variables:');
  console.log('  BREVO_API_KEY:', process.env.BREVO_API_KEY ? '✅ Set' : '❌ Not set');
  console.log('  EMAIL_FROM:', process.env.EMAIL_FROM || '❌ Not set');
  console.log('  NODE_ENV:', process.env.NODE_ENV || 'development');
  console.log();
  
  if (!process.env.BREVO_API_KEY) {
    console.error('❌ BREVO_API_KEY not set!');
    console.log('Set it in your production environment.');
    return;
  }
  
  // Test Brevo API
  console.log('Testing Brevo API...');
  try {
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: {
          name: process.env.EMAIL_FROM_NAME || 'NHIS System',
          email: process.env.EMAIL_FROM
        },
        to: [{ email: process.env.EMAIL_FROM }], // Send to yourself
        subject: 'Production Email Test',
        htmlContent: '<h1>Test Email</h1><p>If you receive this, production email is working!</p>'
      },
      {
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json'
        }
      }
    );
    
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', response.data.messageId);
    console.log('\nCheck your inbox:', process.env.EMAIL_FROM);
  } catch (error) {
    console.error('❌ Email failed!');
    console.error('Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('\n💡 Fix: Invalid API key. Get new one from:');
      console.log('   https://app.brevo.com/settings/keys/api');
    } else if (error.response?.data?.message?.includes('sender')) {
      console.log('\n💡 Fix: Verify sender email at:');
      console.log('   https://app.brevo.com/senders');
    }
  }
}

testProductionEmail();
```

**Run on production server:**
```bash
node test-production-email.js
```

---

## 🚀 Recommended Solution

### Step 1: Verify Environment Variables

**Check what's set in production:**

For Render:
1. Dashboard → Your Service → Environment
2. Verify `BREVO_API_KEY`, `EMAIL_FROM`, `EMAIL_FROM_NAME` are set

For Heroku:
```bash
heroku config --app your-app-name
```

### Step 2: Verify Sender Email

1. Go to: https://app.brevo.com/senders
2. Ensure `sharifiddrisu156@gmail.com` is verified
3. If not, verify it now

### Step 3: Check Production Logs

Look for email-related errors:
- "Brevo failed"
- "unauthorized"
- "sender not verified"
- "Key not found"

### Step 4: Test with Curl

```bash
# Test Brevo API directly
curl -X POST https://api.brevo.com/v3/smtp/email \
  -H "accept: application/json" \
  -H "api-key: your-actual-brevo-api-key-here" \
  -H "content-type: application/json" \
  -d '{
    "sender": {"name": "NHIS System", "email": "your-verified-email@example.com"},
    "to": [{"email": "your-verified-email@example.com"}],
    "subject": "Test",
    "htmlContent": "<p>Test</p>"
  }'
```

If this works, the issue is in your production environment variables.

---

## 📊 Common Error Messages

### "Key not found" or "unauthorized"
**Cause:** Invalid or missing API key
**Fix:** Set correct `BREVO_API_KEY` in production environment

### "Sender email not verified"
**Cause:** Sender email not verified in Brevo
**Fix:** Verify email at https://app.brevo.com/senders

### "Daily sending limit exceeded"
**Cause:** Sent more than 300 emails today
**Fix:** Wait 24 hours or upgrade plan

### "Network error" or "ECONNREFUSED"
**Cause:** Can't reach Brevo API
**Fix:** Check firewall, network settings

### No error, but email not received
**Cause:** Email in spam or Brevo dashboard shows bounce
**Fix:** Check spam folder, verify sender, check Brevo dashboard

---

## 🆘 Still Not Working?

### Share These Details:

1. **Hosting Platform:**
   - Where is your backend deployed? (Render, Heroku, Railway, etc.)

2. **Environment Variables:**
   - Are they set in production? (Yes/No)
   - Can you see them in your platform's dashboard?

3. **Production Logs:**
   - What errors do you see?
   - Copy the relevant log lines

4. **Brevo Dashboard:**
   - Is sender email verified?
   - Any emails in statistics?
   - Any error messages?

5. **Test Results:**
   - Does curl test work?
   - Does test script work?

---

## 📚 Platform-Specific Guides

### Render
```
Dashboard → Service → Environment → Add Variable
BREVO_API_KEY = your-key
EMAIL_FROM = sharifiddrisu156@gmail.com
EMAIL_FROM_NAME = NHIS Appointment System
```

### Heroku
```bash
heroku config:set BREVO_API_KEY=your-key
heroku config:set EMAIL_FROM=sharifiddrisu156@gmail.com
heroku config:set EMAIL_FROM_NAME="NHIS Appointment System"
```

### Railway
```
Project → Service → Variables → New Variable
```

### Vercel (for serverless functions)
```
Project Settings → Environment Variables
```

### AWS Elastic Beanstalk
```
Configuration → Software → Environment properties
```

---

**Most likely issue:** Environment variables not set in production. Check your hosting platform's environment variable settings first! 🎯
