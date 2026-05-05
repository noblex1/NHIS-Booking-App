# 🚨 Production Email Not Working - Fix It Now!

## 🎯 The Problem

Emails work locally but not in production. This is almost always because **environment variables are not set in your production environment**.

---

## ⚡ Quick Fix (5 Minutes)

### Step 1: Set Environment Variables

Go to your hosting platform and add these environment variables:

```
BREVO_API_KEY=your-actual-brevo-api-key-here
EMAIL_FROM=your-verified-email@example.com
EMAIL_FROM_NAME=NHIS Appointment System
```

#### Where to Add Them:

**Render:**
1. Go to: https://dashboard.render.com/
2. Select your backend service
3. Click "Environment" tab
4. Click "Add Environment Variable"
5. Add the 3 variables above
6. Click "Save Changes"
7. Service will auto-redeploy (wait 2-3 minutes)

**Heroku:**
```bash
heroku config:set BREVO_API_KEY=your-actual-brevo-api-key-here --app your-app-name

heroku config:set EMAIL_FROM=your-verified-email@example.com --app your-app-name

heroku config:set EMAIL_FROM_NAME="NHIS Appointment System" --app your-app-name
```

**Railway:**
1. Go to your project
2. Select your service
3. Click "Variables" tab
4. Add the 3 variables
5. Service will auto-redeploy

**Vercel (Serverless):**
1. Project Settings → Environment Variables
2. Add the 3 variables
3. Redeploy

### Step 2: Verify Sender Email

1. Go to: https://app.brevo.com/senders
2. Check if `sharifiddrisu156@gmail.com` is verified (green checkmark)
3. If NOT verified:
   - Click "Add a new sender"
   - Enter: `sharifiddrisu156@gmail.com`
   - Name: `NHIS Appointment System`
   - Check your Gmail inbox
   - Click the verification link
   - Wait 1-2 minutes

### Step 3: Test

1. Wait for deployment to complete (2-3 minutes)
2. Try registration in production
3. Check your email for OTP
4. ✅ Should work now!

---

## 🧪 Verify It's Fixed

### Test 1: Check Environment Variables

**Render:**
- Dashboard → Service → Environment
- You should see all 3 variables

**Heroku:**
```bash
heroku config --app your-app-name
```
Should show all 3 variables

**Railway:**
- Service → Variables
- Should show all 3 variables

### Test 2: Check Production Logs

Try registration and check logs:

**Render:**
- Dashboard → Service → Logs
- Should see: `[INFO] OTP email sent via Brevo`

**Heroku:**
```bash
heroku logs --tail --app your-app-name
```

**Railway:**
- Service → Deployments → Latest → Logs

### Test 3: Try Registration

1. Go to your production URL
2. Register a new user
3. Check email for OTP
4. ✅ Success!

---

## 🐛 Still Not Working?

### Run Diagnostic Script

If you have SSH access to your production server:

```bash
# Upload test-production-email.js to server
# Then run:
node test-production-email.js
```

This will tell you exactly what's wrong.

### Check These:

1. **Environment Variables Set?**
   - Check your hosting platform dashboard
   - All 3 variables should be there
   - Values should match exactly

2. **Sender Email Verified?**
   - Go to: https://app.brevo.com/senders
   - Should show "Verified" status
   - If not, verify it now

3. **Service Redeployed?**
   - After adding env vars, service must redeploy
   - Wait 2-3 minutes for deployment
   - Check deployment status

4. **API Key Valid?**
   - Go to: https://app.brevo.com/settings/keys/api
   - Check if key is active
   - If expired, create new one

5. **Daily Limit?**
   - Go to: https://app.brevo.com/statistics/email
   - Check if you've exceeded 300 emails/day
   - If yes, wait 24 hours or upgrade

---

## 📋 Common Errors & Fixes

### Error: "Key not found" or "unauthorized"

**Cause:** `BREVO_API_KEY` not set or invalid

**Fix:**
1. Set `BREVO_API_KEY` in production environment
2. Make sure it starts with `xkeysib-`
3. Redeploy service

### Error: "Sender email not verified"

**Cause:** Sender email not verified in Brevo

**Fix:**
1. Go to: https://app.brevo.com/senders
2. Verify `sharifiddrisu156@gmail.com`
3. Check Gmail for verification email
4. Click link to verify

### Error: No error, but email not received

**Cause:** Email might be in spam or Brevo shows bounce

**Fix:**
1. Check spam/junk folder
2. Check Brevo dashboard: https://app.brevo.com/statistics/email
3. Look for delivery status
4. Check for bounces or errors

### Error: "Network error" or "ECONNREFUSED"

**Cause:** Production server can't reach Brevo API

**Fix:**
1. Check firewall settings
2. Ensure outbound HTTPS (port 443) is allowed
3. Test: `curl https://api.brevo.com`

---

## ✅ Success Checklist

Mark these off as you complete them:

```
[ ] Added BREVO_API_KEY to production environment
[ ] Added EMAIL_FROM to production environment
[ ] Added EMAIL_FROM_NAME to production environment
[ ] Verified sender email at https://app.brevo.com/senders
[ ] Waited for service to redeploy (2-3 minutes)
[ ] Checked production logs (no errors)
[ ] Tried registration in production
[ ] Received OTP email
[ ] ✅ Production email working!
```

---

## 🎯 Most Likely Solution

**80% of production email issues are fixed by:**

1. Setting environment variables in production
2. Redeploying the service
3. That's it!

**The other 20%:**
- Sender email not verified (15%)
- Invalid/expired API key (5%)

---

## 📞 Need More Help?

### Share These Details:

1. **Hosting Platform:** (Render/Heroku/Railway/Other)

2. **Environment Variables:**
   - Screenshot of your environment variables page
   - Or output of `heroku config`

3. **Production Logs:**
   - Copy error messages
   - Look for "Brevo", "email", "error"

4. **Brevo Dashboard:**
   - Is sender verified? (Yes/No)
   - Screenshot of senders page

5. **Test Results:**
   - What happens when you try registration?
   - Any error messages?

---

## 📚 Documentation

- **Full Guide:** `PRODUCTION_EMAIL_FIX.md`
- **Checklist:** `PRODUCTION_CHECKLIST.md`
- **Test Script:** `test-production-email.js`
- **Brevo Setup:** `BREVO_SETUP_GUIDE.md`

---

## 🚀 Summary

**Problem:** Emails work locally but not in production

**Cause:** Environment variables not set in production (80% of cases)

**Solution:**
1. Add `BREVO_API_KEY`, `EMAIL_FROM`, `EMAIL_FROM_NAME` to production
2. Verify sender email at https://app.brevo.com/senders
3. Redeploy service
4. Test registration
5. ✅ Done!

**Time:** 5 minutes

---

**Go fix it now!** 🎯
