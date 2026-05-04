# 📧 SendGrid Setup Guide

## ✅ SendGrid Email Service Configuration

Your NHIS Booking app now uses SendGrid for reliable, professional email delivery. SendGrid is already integrated and ready to use!

---

## 🎯 Why SendGrid?

### Advantages over Gmail SMTP
- ✅ **Better Deliverability** - Professional email infrastructure
- ✅ **Higher Limits** - 100 emails/day free (vs Gmail's 500 with restrictions)
- ✅ **No App Passwords** - Simple API key authentication
- ✅ **Email Analytics** - Track delivery, opens, clicks
- ✅ **Dedicated IPs** - Better sender reputation (paid plans)
- ✅ **Scalable** - Easy to upgrade as you grow
- ✅ **Professional** - Industry-standard email service

### Free Tier Benefits
- 100 emails/day forever free
- Email validation
- Delivery insights
- Sender authentication
- API access
- Email activity tracking

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create SendGrid Account

1. **Sign Up**
   - Go to: https://signup.sendgrid.com/
   - Enter your email and create password
   - Complete the signup form
   - Verify your email address

2. **Complete Onboarding**
   - Choose "Web App" as integration type
   - Select "SMTP Relay" or "Web API"
   - Skip the code integration (we've already done it!)

### Step 2: Create API Key

1. **Navigate to API Keys**
   - Go to: https://app.sendgrid.com/settings/api_keys
   - Or: Settings → API Keys

2. **Create New API Key**
   - Click "Create API Key"
   - Name: `NHIS Booking App`
   - Permission: **Full Access** (or at minimum "Mail Send")
   - Click "Create & View"

3. **Copy API Key**
   - **IMPORTANT**: Copy the API key NOW
   - You won't be able to see it again!
   - Format: `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 3: Verify Sender Email

**Option A: Single Sender Verification (Easiest)**

1. Go to: https://app.sendgrid.com/settings/sender_auth/senders
2. Click "Create New Sender"
3. Fill in the form:
   ```
   From Name: NHIS Appointment System
   From Email: noreply@yourdomain.com (or your email)
   Reply To: support@yourdomain.com (optional)
   Company Address: Your address
   ```
4. Click "Create"
5. Check your email for verification link
6. Click the verification link
7. ✅ Sender verified!

**Option B: Domain Authentication (Advanced)**

1. Go to: https://app.sendgrid.com/settings/sender_auth
2. Click "Authenticate Your Domain"
3. Follow DNS setup instructions
4. Add DNS records to your domain
5. Wait for verification (can take up to 48 hours)

### Step 4: Update `.env` File

Open your `.env` file and add:

```env
# SendGrid Configuration
SENDGRID_API_KEY=SG.your-actual-api-key-here
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=NHIS Appointment System
```

**Important:**
- Replace `SG.your-actual-api-key-here` with your actual API key
- Replace `noreply@yourdomain.com` with your verified sender email
- Make sure `EMAIL_FROM` matches the verified sender in SendGrid

### Step 5: Test Email Sending

```bash
# Test with your email
node test-email.js your-email@example.com
```

**Expected Output:**
```
🧪 Testing email service

Configuration:
  Provider: SendGrid (SENDGRID_API_KEY set)
  From: noreply@yourdomain.com
  Test recipient: your-email@example.com

📧 Test 1: Sending OTP email...
✅ OTP email sent successfully!

📧 Test 2: Sending appointment confirmation email...
✅ Appointment confirmation email sent successfully!

🎉 All tests passed!
```

---

## 🔧 Configuration Reference

### Environment Variables

```env
# Required
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com

# Optional
EMAIL_FROM_NAME=NHIS Appointment System

# SMTP Fallback (optional - only used if SENDGRID_API_KEY is not set)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_SECURE=false
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
```

### How It Works

The email service automatically detects which method to use:

```javascript
if (SENDGRID_API_KEY is set) {
  → Use SendGrid API ✅
} else if (SMTP credentials are set) {
  → Use SMTP fallback
} else {
  → Log only (development mode)
}
```

---

## 📊 SendGrid Dashboard

### Email Activity
- View all sent emails: https://app.sendgrid.com/email_activity
- Filter by date, recipient, status
- See delivery status, opens, clicks
- Debug delivery issues

### Statistics
- View sending stats: https://app.sendgrid.com/statistics
- Daily/weekly/monthly reports
- Delivery rates
- Bounce rates
- Spam reports

### API Keys
- Manage keys: https://app.sendgrid.com/settings/api_keys
- Create new keys
- Delete old keys
- View key permissions

### Sender Authentication
- Manage senders: https://app.sendgrid.com/settings/sender_auth
- Verify new senders
- Domain authentication
- View verification status

---

## 🧪 Testing

### Test Script
```bash
# Test with your email
node test-email.js your-email@example.com

# Test with different email
node test-email.js another-email@example.com
```

### Manual Test via Registration
1. Start backend: `npm run dev`
2. Start frontend: `cd client && npm run dev`
3. Go to: http://localhost:5173/register
4. Register with your email
5. Check email for OTP
6. Verify OTP
7. ✅ Success!

### Check SendGrid Dashboard
1. Go to: https://app.sendgrid.com/email_activity
2. See your test emails
3. Check delivery status
4. View email content

---

## 🐛 Troubleshooting

### Issue: "Unauthorized" Error

**Cause:** Invalid API key

**Solution:**
1. Check API key is correct in `.env`
2. Verify API key has "Mail Send" permission
3. Create new API key if needed
4. Make sure no extra spaces in API key

### Issue: "The from address does not match a verified Sender Identity"

**Cause:** Sender email not verified

**Solution:**
1. Go to: https://app.sendgrid.com/settings/sender_auth/senders
2. Verify your sender email
3. Make sure `EMAIL_FROM` in `.env` matches verified sender
4. Wait for verification email and click link

### Issue: Emails Going to Spam

**Cause:** New sender reputation

**Solution:**
1. Verify sender email/domain
2. Set up domain authentication (SPF, DKIM)
3. Start with low volume, gradually increase
4. Ask recipients to whitelist your email
5. Use professional email content

### Issue: "Daily sending limit exceeded"

**Cause:** Exceeded 100 emails/day on free tier

**Solution:**
1. Wait 24 hours for limit reset
2. Upgrade to paid plan for higher limits
3. Check SendGrid dashboard for usage

### Issue: Emails Not Arriving

**Cause:** Various reasons

**Solution:**
1. Check SendGrid email activity dashboard
2. Look for delivery status
3. Check spam folder
4. Verify recipient email is correct
5. Check for bounces or blocks

---

## 📈 Sending Limits

### Free Tier
- **100 emails/day** forever free
- No credit card required
- Full API access
- Email analytics
- Sender authentication

### Paid Plans
| Plan | Price | Emails/Month | Daily Limit |
|------|-------|--------------|-------------|
| Essentials | $19.95/mo | 50,000 | ~1,666/day |
| Pro | $89.95/mo | 100,000 | ~3,333/day |
| Premier | Custom | Unlimited | Custom |

### Upgrade When Needed
- Go to: https://app.sendgrid.com/settings/billing
- Choose plan
- Add payment method
- Instant upgrade

---

## 🔐 Security Best Practices

### API Key Security
- ✅ Never commit API keys to Git
- ✅ Use environment variables
- ✅ Rotate keys periodically
- ✅ Use minimum required permissions
- ✅ Delete unused keys

### Sender Authentication
- ✅ Verify sender email
- ✅ Set up domain authentication (SPF, DKIM, DMARC)
- ✅ Use professional email addresses
- ✅ Don't use personal emails for production

### Email Content
- ✅ Include unsubscribe link (for marketing emails)
- ✅ Use clear, professional language
- ✅ Include company information
- ✅ Avoid spam trigger words
- ✅ Test emails before sending to users

---

## 🌐 Production Deployment

### Environment Variables

When deploying to production (Render, Heroku, Vercel, etc.):

1. **Set Environment Variables**
   ```
   SENDGRID_API_KEY=SG.your-production-api-key
   EMAIL_FROM=noreply@yourdomain.com
   EMAIL_FROM_NAME=NHIS Appointment System
   ```

2. **Verify Sender**
   - Use your production domain
   - Set up domain authentication
   - Verify sender email

3. **Test in Production**
   - Send test emails
   - Check delivery
   - Monitor SendGrid dashboard

### Domain Authentication (Recommended)

For production, set up domain authentication:

1. Go to: https://app.sendgrid.com/settings/sender_auth
2. Click "Authenticate Your Domain"
3. Enter your domain (e.g., `yourdomain.com`)
4. Add DNS records provided by SendGrid:
   ```
   Type: CNAME
   Host: em1234.yourdomain.com
   Value: u1234567.wl123.sendgrid.net
   
   Type: CNAME
   Host: s1._domainkey.yourdomain.com
   Value: s1.domainkey.u1234567.wl123.sendgrid.net
   
   Type: CNAME
   Host: s2._domainkey.yourdomain.com
   Value: s2.domainkey.u1234567.wl123.sendgrid.net
   ```
5. Wait for DNS propagation (up to 48 hours)
6. Verify in SendGrid dashboard

---

## 📊 Monitoring

### Email Activity
- Check daily: https://app.sendgrid.com/email_activity
- Monitor delivery rates
- Watch for bounces
- Check spam reports

### Statistics
- View trends: https://app.sendgrid.com/statistics
- Track delivery rates
- Monitor engagement
- Identify issues early

### Alerts
- Set up alerts for:
  - High bounce rates
  - Spam complaints
  - Delivery failures
  - API errors

---

## ✅ Checklist

- [ ] Created SendGrid account
- [ ] Verified email address
- [ ] Created API key with Mail Send permission
- [ ] Copied API key to `.env` file
- [ ] Verified sender email in SendGrid
- [ ] Updated `EMAIL_FROM` in `.env`
- [ ] Tested with `node test-email.js`
- [ ] Received test emails
- [ ] Checked SendGrid dashboard
- [ ] Tested registration flow
- [ ] Received OTP email
- [ ] Verified OTP successfully

---

## 🎉 Summary

**What You Have:**
- ✅ Professional email service (SendGrid)
- ✅ 100 emails/day free forever
- ✅ Better deliverability than Gmail
- ✅ Email analytics and tracking
- ✅ Easy to scale
- ✅ Already integrated and working

**What You Need:**
1. SendGrid account (free)
2. API key
3. Verified sender email
4. Update `.env` file
5. Test and deploy!

---

## 📚 Resources

- **SendGrid Dashboard**: https://app.sendgrid.com/
- **API Keys**: https://app.sendgrid.com/settings/api_keys
- **Sender Auth**: https://app.sendgrid.com/settings/sender_auth
- **Email Activity**: https://app.sendgrid.com/email_activity
- **Documentation**: https://docs.sendgrid.com/
- **Support**: https://support.sendgrid.com/

---

**Ready to send professional emails!** 🚀📧
