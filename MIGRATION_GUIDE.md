# Migration Guide: SMS to Email OTP

This guide explains the changes made to migrate from SMS-based OTP to Email-based OTP using Brevo.

## 🔄 Changes Summary

### Database Schema Changes

#### User Model
**Before:**
```javascript
{
  fullName: String,
  nhisNumber: String,
  dateOfBirth: Date,
  phoneNumber: String,  // ❌ REMOVED
  isVerified: Boolean
}
```

**After:**
```javascript
{
  fullName: String,
  nhisNumber: String,
  dateOfBirth: Date,
  email: String,  // ✅ ADDED
  isVerified: Boolean
}
```

#### OTP Model
**Before:**
```javascript
{
  phoneNumber: String,  // ❌ REMOVED
  otpHash: String,
  expiresAt: Date,
  attempts: Number
}
```

**After:**
```javascript
{
  email: String,  // ✅ ADDED
  otpHash: String,
  expiresAt: Date,
  attempts: Number
}
```

### API Changes

#### Registration Endpoint
**Before:**
```json
POST /api/auth/register
{
  "fullName": "John Doe",
  "dateOfBirth": "1990-01-01",
  "phoneNumber": "+233201234567"
}
```

**After:**
```json
POST /api/auth/register
{
  "fullName": "John Doe",
  "dateOfBirth": "1990-01-01",
  "email": "john.doe@example.com"
}
```

#### Verify OTP Endpoint
**Before:**
```json
POST /api/auth/verify-otp
{
  "phoneNumber": "+233201234567",
  "otpCode": "123456"
}
```

**After:**
```json
POST /api/auth/verify-otp
{
  "email": "john.doe@example.com",
  "otpCode": "123456"
}
```

#### Resend OTP Endpoint
**Before:**
```json
POST /api/auth/resend-otp
{
  "phoneNumber": "+233201234567"
}
```

**After:**
```json
POST /api/auth/resend-otp
{
  "email": "john.doe@example.com"
}
```

### Files Modified

1. ✅ `src/models/User.js` - Replaced phoneNumber with email
2. ✅ `src/models/OTP.js` - Replaced phoneNumber with email
3. ✅ `src/services/email.service.js` - **NEW** - Email service using Brevo
4. ✅ `src/services/otp.service.js` - Updated to use email
5. ✅ `src/controllers/auth.controller.js` - Updated all auth logic
6. ✅ `src/controllers/appointment.controller.js` - Updated to send email confirmations
7. ✅ `src/utils/validators.js` - Updated validators for email
8. ✅ `.env.example` - Updated environment variables
9. ✅ `package.json` - Added nodemailer dependency
10. ❌ `src/services/sms.service.js` - **DELETED**
11. ✅ `README_BACKEND.md` - Updated documentation

### Environment Variables

#### Removed:
```env
SMS_PROVIDER=twilio
SMS_SENDER_ID=NHIS
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
HUBTEL_CLIENT_ID=
HUBTEL_CLIENT_SECRET=
HUBTEL_SENDER_ID=
HUBTEL_API_BASE_URL=
```

#### Added:
```env
BREVO_SMTP_USER=your-brevo-email@example.com
BREVO_SMTP_PASS=your-brevo-api-key
EMAIL_FROM_NAME=NHIS Appointment System
```

## 🚀 Setup Instructions

### 1. Get Brevo Credentials

1. Sign up at https://www.brevo.com (free tier available)
2. Verify your email address
3. Go to **Settings** → **SMTP & API**
4. Copy your **Login** (email) and **Master Password** (API key)

### 2. Update Environment Variables

Create or update your `.env` file:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/nhis_booking

JWT_SECRET=your-strong-secret-key-here
JWT_EXPIRES_IN=7d

OTP_EXPIRY_MINUTES=5
OTP_LENGTH=6
OTP_MAX_ATTEMPTS=5

# Brevo Configuration
BREVO_SMTP_USER=your-email@example.com
BREVO_SMTP_PASS=your-brevo-api-key
EMAIL_FROM_NAME=NHIS Appointment System
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Database Migration (Optional)

If you have existing data, you'll need to migrate:

```javascript
// Run this in MongoDB shell or create a migration script
db.users.updateMany(
  {},
  {
    $rename: { phoneNumber: "email" }
  }
);

db.otps.updateMany(
  {},
  {
    $rename: { phoneNumber: "email" }
  }
);
```

**Note:** This is a simple rename. You may want to clean up data or start fresh.

### 5. Start the Server

```bash
npm run dev
```

## 📧 Email Templates

The system sends two types of emails:

### 1. OTP Verification Email
- **Subject:** "NHIS Verification Code"
- **Content:** Styled HTML with OTP code
- **Expiry:** 5 minutes (configurable)

### 2. Appointment Confirmation Email
- **Subject:** "NHIS Appointment Confirmation"
- **Content:** Appointment details with date and time
- **Sent:** After successful booking

## 🔒 Security Features

- ✅ OTP is hashed before storage (SHA-256)
- ✅ OTP expires after 5 minutes
- ✅ Maximum 5 attempts per OTP
- ✅ Rate limiting on OTP endpoints
- ✅ Email validation and normalization
- ✅ Automatic OTP cleanup via MongoDB TTL index

## 🧪 Testing

### Test Registration Flow:

```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "dateOfBirth": "1990-01-01",
    "email": "test@example.com"
  }'

# Response: { "success": true, "message": "OTP sent to your email" }

# 2. Check your email for OTP

# 3. Verify OTP
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otpCode": "123456"
  }'

# Response: { "success": true, "token": "...", "user": {...} }
```

## 📝 Frontend Updates Needed

The frontend will need to be updated to:

1. Replace phone number input with email input
2. Update validation schemas (Zod)
3. Update API calls to use email instead of phoneNumber
4. Update UI text/labels

Files to update:
- `client/src/routes/register.tsx`
- `client/src/routes/verify.tsx`
- `client/src/lib/auth-store.ts`

## ⚠️ Breaking Changes

1. **API Contract Changed:** All auth endpoints now use `email` instead of `phoneNumber`
2. **Database Schema Changed:** User and OTP models updated
3. **Dependencies Changed:** Removed axios (for SMS), added nodemailer
4. **Environment Variables Changed:** Brevo config replaces Twilio/Hubtel

## 🎯 Benefits of Email OTP

- ✅ No SMS costs
- ✅ More reliable delivery
- ✅ Better formatting options (HTML emails)
- ✅ Easier to test in development
- ✅ Free tier available (Brevo: 300 emails/day)
- ✅ Email is more universal than phone numbers

## 🐛 Troubleshooting

### Email not sending?
1. Check Brevo credentials in `.env`
2. Verify your Brevo account is active
3. Check server logs for errors
4. Ensure port 587 is not blocked

### OTP not received?
1. Check spam/junk folder
2. Verify email address is correct
3. Check Brevo dashboard for delivery status
4. Review server logs

### Development Mode
If credentials are missing, emails will be logged to console instead of sent.

## 📚 Additional Resources

- [Brevo Documentation](https://developers.brevo.com/)
- [Nodemailer Documentation](https://nodemailer.com/)
- [Express Validator](https://express-validator.github.io/)

---

**Migration completed successfully! 🎉**
