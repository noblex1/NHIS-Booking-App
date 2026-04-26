# 📧 Brevo (Sendinblue) Setup Guide

## Step-by-Step Instructions

### 1. Create Brevo Account

1. **Visit:** https://www.brevo.com
2. **Click:** "Sign up free" button
3. **Fill in:**
   - Email address
   - Password
   - Company name (can be "NHIS Appointment System")
4. **Click:** "Create my account"

### 2. Verify Your Email

1. Check your email inbox
2. Open the verification email from Brevo
3. Click the verification link
4. Complete any additional setup steps

### 3. Get SMTP Credentials

#### Option A: Using Dashboard (Recommended)

1. **Login** to your Brevo account
2. **Navigate to:** Settings (top right) → SMTP & API
3. **Find the SMTP section**
4. You'll see:
   ```
   SMTP server: smtp-relay.brevo.com
   Port: 587
   Login: your-email@example.com
   ```
5. **Generate SMTP Key:**
   - Click "Generate a new SMTP key" button
   - Give it a name (e.g., "NHIS App")
   - Copy the generated key immediately (you won't see it again!)
   - This is your `BREVO_SMTP_PASS`

#### Option B: Using API Key

1. Go to Settings → SMTP & API
2. Click on "API Keys" tab
3. Click "Generate a new API key"
4. Name it (e.g., "NHIS Backend")
5. Copy the key (this can also be used as SMTP password)

### 4. Important Information

**Your Credentials:**
- **SMTP Server:** `smtp-relay.brevo.com` (already configured in code)
- **Port:** `587` (already configured in code)
- **Login (BREVO_SMTP_USER):** Your Brevo account email
- **Password (BREVO_SMTP_PASS):** The SMTP key you just generated

**Free Tier Limits:**
- ✅ 300 emails per day
- ✅ Unlimited contacts
- ✅ Email templates
- ✅ SMTP relay
- ✅ API access

### 5. Verify Sender Email (Important!)

For better deliverability:

1. Go to **Settings** → **Senders & IP**
2. Click **"Add a sender"**
3. Enter your email address
4. Verify it via the confirmation email
5. This email will be used as the "From" address

### 6. Test Your Setup

Once you have your credentials, test them:

```bash
# In your project directory
node test-email.js your-email@example.com
```

---

## 🔒 Security Best Practices

1. **Never commit** `.env` file to git
2. **Use different keys** for development and production
3. **Rotate keys** periodically
4. **Monitor usage** in Brevo dashboard
5. **Set up alerts** for unusual activity

---

## 📊 Monitoring

**Brevo Dashboard provides:**
- Email delivery statistics
- Bounce rates
- Open rates (if tracking enabled)
- Failed deliveries
- Real-time logs

**Access:** https://app.brevo.com → Statistics

---

## 🐛 Troubleshooting

### "Authentication failed" error
- ✅ Verify you're using the SMTP key, not your account password
- ✅ Check for extra spaces in credentials
- ✅ Ensure account is verified

### Emails not arriving
- ✅ Check spam/junk folder
- ✅ Verify sender email is confirmed in Brevo
- ✅ Check Brevo logs for delivery status
- ✅ Ensure you haven't exceeded daily limit (300 emails)

### "Connection timeout" error
- ✅ Check internet connection
- ✅ Verify port 587 is not blocked by firewall
- ✅ Try using port 465 with SSL (requires code change)

---

## 📞 Support

- **Brevo Help Center:** https://help.brevo.com
- **API Documentation:** https://developers.brevo.com
- **Status Page:** https://status.brevo.com

---

## ✅ Checklist

- [ ] Created Brevo account
- [ ] Verified email address
- [ ] Generated SMTP key
- [ ] Copied credentials
- [ ] Added sender email
- [ ] Updated `.env` file
- [ ] Tested email sending
- [ ] Verified email delivery

---

**Once you have your credentials, update the `.env` file and test!**
