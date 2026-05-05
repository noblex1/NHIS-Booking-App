# 📧 Brevo (Sendinblue) Setup Guide

## ✅ Brevo Email Service Configuration

Your NHIS Booking app now uses Brevo (formerly Sendinblue) for reliable, professional email delivery. Brevo is already integrated and ready to use!

---

## 🎯 Why Brevo?

### Advantages
- ✅ **Generous Free Tier** - 300 emails/day (vs SendGrid's 100)
- ✅ **Better Deliverability** - Professional email infrastructure
- ✅ **No Credit Card Required** - Free tier doesn't need payment info
- ✅ **Simple API** - Easy to integrate and use
- ✅ **Email Analytics** - Track delivery, opens, clicks
- ✅ **SMS Capability** - Can add SMS later (paid)
- ✅ **Marketing Tools** - Email campaigns, automation (optional)
- ✅ **GDPR Compliant** - European data protection standards

### Free Tier Benefits
- **300 emails/day** forever free
- Unlimited contacts
- Email templates
- Real-time statistics
- API access
- Transactional emails
- SMTP relay
- Email validation

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Brevo Account

1. **Sign Up**
   - Go to: https://app.brevo.com/account/register
   - Enter your email and create password
   - Complete the signup form
   - Verify your email address

2. **Complete Profile**
   - Add your company information
   - Verify your phone number (optional but recommended)
   - Complete onboarding wizard

### Step 2: Create API Key

1. **Navigate to API Keys**
   - Go to: https://app.brevo.com/settings/keys/api
   - Or: Settings → SMTP & API → API Keys

2. **Create New API Key**
   - Click "Generate a new API key"
   - Name: `NHIS Booking App`
   - Click "Generate"

3. **Copy API Key**
   - **IMPORTANT**: Copy the API key NOW
   - Format: `xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Store it securely

### Step 3: Verify Sender Email

**Single Sender Verification (Recommended for Start)**

1. Go to: https://app.brevo.com/senders
2. Click "Add a new sender"
3. Enter your email address
4. Enter sender name: `NHIS Appointment System`
5. Click "Add"
6. Check your email for verification link
7. Click the verification link
8. ✅ Sender verified!

**Note:** You can verify multiple sender emails or set up domain authentication later.

### Step 4: Update `.env` File

Open your `.env` file and update:

```env
# Brevo Configuration
BREVO_API_KEY=xkeysib-your-actual-api-key-here
EMAIL_FROM=your-verified-email@example.com
EMAIL_FROM_NAME=NHIS Appointment System
```

**Important:**
- Replace `xkeysib-your-actual-api-key-here` with your actual API key
- Replace `your-verified-email@example.com` with your verified sender email
- Make sure `EMAIL_FROM` matches the verified sender in Brevo

### Step 5: Test Email Sending

```bash
# Test with your email
node test-email.js your-email@example.com
```

**Expected Output:**
```
🧪 Testing email service

Configuration:
  Provider: Brevo (BREVO_API_KEY set)
  From: your-verified-email@example.com
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
BREVO_API_KEY=xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com

# Optional
EMAIL_FROM_NAME=NHIS Appointment System

# SMTP Fallback (optional - only used if BREVO_API_KEY is not set)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_SECURE=false
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
```

### How It Works

The email service automatically detects which method to use:

```javascript
if (BREVO_API_KEY is set) {
  → Use Brevo API ✅
} else if (SMTP credentials are set) {
  → Use SMTP fallback
} else {
  → Log only (development mode)
}
```

---

## 📊 Brevo Dashboard

### Email Statistics
- View all sent emails: https://app.brevo.com/statistics/email
- Real-time delivery tracking
- Open rates and click rates
- Bounce and spam reports
- Geographic data

### Transactional Emails
- View sent emails: https://app.brevo.com/email/transactional
- Filter by date, status, recipient
- See email content
- Debug delivery issues

### Senders
- Manage senders: https://app.brevo.com/senders
- Add new senders
- Verify email addresses
- Set up domain authentication

### API Keys
- Manage keys: https://app.brevo.com/settings/keys/api
- Create new keys
- Delete old keys
- View key usage

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

### Check Brevo Dashboard
1. Go to: https://app.brevo.com/statistics/email
2. See your test emails
3. Check delivery status
4. View email content

---

## 🐛 Troubleshooting

### Issue: "Unauthorized" or "Invalid API key"

**Cause:** Invalid or incorrect API key

**Solution:**
1. Check API key is correct in `.env`
2. Make sure no extra spaces or line breaks
3. Verify API key is active in Brevo dashboard
4. Create new API key if needed
5. Restart backend after updating `.env`

### Issue: "Sender email not verified"

**Cause:** Sender email not verified in Brevo

**Solution:**
1. Go to: https://app.brevo.com/senders
2. Add and verify your sender email
3. Make sure `EMAIL_FROM` in `.env` matches verified sender
4. Wait for verification email and click link
5. Check verification status in dashboard

### Issue: Emails Going to Spam

**Cause:** New sender reputation or content issues

**Solution:**
1. Verify sender email/domain
2. Set up domain authentication (SPF, DKIM, DMARC)
3. Use professional email content
4. Avoid spam trigger words
5. Ask recipients to whitelist your email
6. Start with low volume, gradually increase

### Issue: "Daily sending limit exceeded"

**Cause:** Exceeded 300 emails/day on free tier

**Solution:**
1. Wait 24 hours for limit reset
2. Check usage in Brevo dashboard
3. Upgrade to paid plan for higher limits
4. Optimize email sending (batch, schedule)

### Issue: Emails Not Arriving

**Cause:** Various reasons

**Solution:**
1. Check Brevo statistics dashboard
2. Look for delivery status
3. Check spam folder
4. Verify recipient email is correct
5. Check for bounces or blocks
6. Review email content for issues

---

## 📈 Sending Limits

### Free Tier
- **300 emails/day** forever free
- Unlimited contacts
- No credit card required
- Full API access
- Email analytics
- Transactional emails

### Paid Plans
| Plan | Price | Emails/Month | Daily Limit |
|------|-------|--------------|-------------|
| Lite | $25/mo | 20,000 | ~666/day |
| Premium | $65/mo | 20,000 + extras | ~666/day |
| Enterprise | Custom | Unlimited | Custom |

**Note:** Paid plans include additional features like:
- Advanced statistics
- A/B testing
- Marketing automation
- Landing pages
- Facebook ads
- Retargeting
- Premium support

### Upgrade When Needed
- Go to: https://app.brevo.com/settings/plan
- Choose plan
- Add payment method
- Instant upgrade

---

## 🔐 Security Best Practices

### API Key Security
- ✅ Never commit API keys to Git
- ✅ Use environment variables
- ✅ Rotate keys periodically
- ✅ Delete unused keys
- ✅ Use separate keys for dev/prod

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
   BREVO_API_KEY=xkeysib-your-production-api-key
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
   - Monitor Brevo dashboard

### Domain Authentication (Recommended)

For production, set up domain authentication:

1. Go to: https://app.brevo.com/settings/domains
2. Click "Add a domain"
3. Enter your domain (e.g., `yourdomain.com`)
4. Add DNS records provided by Brevo:
   ```
   Type: TXT
   Host: @
   Value: v=spf1 include:spf.brevo.com ~all
   
   Type: TXT
   Host: mail._domainkey
   Value: [provided by Brevo]
   
   Type: CNAME
   Host: brevo._domainkey
   Value: [provided by Brevo]
   ```
5. Wait for DNS propagation (up to 48 hours)
6. Verify in Brevo dashboard

---

## 📊 Monitoring

### Email Statistics
- Check daily: https://app.brevo.com/statistics/email
- Monitor delivery rates
- Watch for bounces
- Check spam reports
- Track opens and clicks

### Transactional Emails
- View sent emails: https://app.brevo.com/email/transactional
- Filter by status
- Debug issues
- Export data

### Alerts
- Set up alerts for:
  - High bounce rates
  - Spam complaints
  - Delivery failures
  - API errors
  - Daily limit approaching

---

## ✅ Checklist

- [ ] Created Brevo account
- [ ] Verified email address
- [ ] Created API key
- [ ] Copied API key to `.env` file
- [ ] Verified sender email in Brevo
- [ ] Updated `EMAIL_FROM` in `.env`
- [ ] Tested with `node test-email.js`
- [ ] Received test emails
- [ ] Checked Brevo dashboard
- [ ] Tested registration flow
- [ ] Received OTP email
- [ ] Verified OTP successfully

---

## 🎉 Summary

**What You Have:**
- ✅ Professional email service (Brevo)
- ✅ 300 emails/day free forever
- ✅ Better than SendGrid free tier
- ✅ Email analytics and tracking
- ✅ Easy to scale
- ✅ Already integrated and working

**What You Need:**
1. Brevo account (free)
2. API key
3. Verified sender email
4. Update `.env` file
5. Test and deploy!

---

## 📚 Resources

- **Brevo Dashboard**: https://app.brevo.com/
- **API Keys**: https://app.brevo.com/settings/keys/api
- **Senders**: https://app.brevo.com/senders
- **Statistics**: https://app.brevo.com/statistics/email
- **Documentation**: https://developers.brevo.com/
- **Support**: https://help.brevo.com/

---

**Ready to send professional emails with Brevo!** 🚀📧
