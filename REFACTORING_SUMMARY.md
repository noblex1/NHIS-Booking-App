# ✅ Backend Refactoring Complete: SMS → Email OTP

## 🎯 Objective Achieved

Successfully refactored the NHIS Appointment System backend from SMS-based OTP (Twilio/Hubtel) to Email-based OTP using Brevo (Sendinblue).

---

## 📋 Changes Implemented

### 1. ✅ User Model Updated
**File:** `src/models/User.js`

- ❌ Removed: `phoneNumber` field
- ✅ Added: `email` field (unique, required, lowercase, indexed)
- Maintained: `fullName`, `dateOfBirth`, `nhisNumber`, `isVerified`

### 2. ✅ OTP Model Updated
**File:** `src/models/OTP.js`

- ❌ Removed: `phoneNumber` field
- ✅ Added: `email` field (indexed, lowercase)
- Maintained: `otpHash`, `expiresAt`, `attempts`
- TTL index remains for automatic cleanup

### 3. ✅ Email Service Created
**File:** `src/services/email.service.js` (NEW)

**Features:**
- Brevo SMTP integration (smtp-relay.brevo.com:587)
- Two email templates:
  - **OTP Verification Email** - Professional HTML template with styled OTP code
  - **Appointment Confirmation Email** - Booking details with date/time
- Graceful fallback (logs to console if credentials missing)
- Configurable sender name and expiry time
- Error handling and logging

### 4. ✅ OTP Service Refactored
**File:** `src/services/otp.service.js`

- Replaced `phoneNumber` with `email` throughout
- Updated `createAndSendOtp()` to use email service
- Updated `verifyOtpCode()` to validate by email
- Maintained security features:
  - OTP hashing (SHA-256)
  - Expiration validation
  - Attempt limiting (max 5)

### 5. ✅ Auth Controller Updated
**File:** `src/controllers/auth.controller.js`

**Updated Endpoints:**

#### `POST /api/auth/register`
- Input: `{ fullName, dateOfBirth, email }`
- Validates email format
- Checks for existing verified users
- Sends OTP via email
- Response: `"OTP sent to your email"`

#### `POST /api/auth/verify-otp`
- Input: `{ email, otpCode }`
- Verifies OTP by email
- Generates NHIS number on first verification
- Returns JWT token and user data

#### `POST /api/auth/resend-otp`
- Input: `{ email }`
- Validates pending registration
- Sends new OTP via email

#### `POST /api/auth/login`
- No changes (still uses NHIS number + DOB)

### 6. ✅ Appointment Controller Updated
**File:** `src/controllers/appointment.controller.js`

- Replaced SMS notification with email confirmation
- `createAppointment()` now sends email to `req.user.email`
- Professional HTML email with appointment details
- Maintained all booking logic and validations

### 7. ✅ Validators Updated
**File:** `src/utils/validators.js`

- ❌ Removed: `phoneRegex` and phone validation
- ✅ Added: Email validation using `express-validator`
- Updated validators:
  - `registerValidator` - now validates email
  - `otpVerifyValidator` - now validates email
  - `resendOtpValidator` - now validates email
- Email normalization (lowercase, trim)

### 8. ✅ Environment Configuration
**File:** `.env.example`

**Removed:**
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

**Added:**
```env
BREVO_SMTP_USER=your-brevo-email@example.com
BREVO_SMTP_PASS=your-brevo-api-key
EMAIL_FROM_NAME=NHIS Appointment System
```

### 9. ✅ Dependencies Updated
**File:** `package.json`

- ✅ Added: `nodemailer@^6.9.16`
- ❌ Removed: No packages removed (axios still used elsewhere)
- ✅ Installed: `npm install` completed successfully

### 10. ❌ SMS Service Deleted
**File:** `src/services/sms.service.js` (DELETED)

- Removed Twilio integration
- Removed Hubtel integration
- No longer needed

### 11. ✅ Documentation Updated
**File:** `README_BACKEND.md`

- Updated stack description
- Added Brevo setup instructions
- Updated API endpoint documentation
- Added email configuration section
- Updated authentication flow

### 12. ✅ Migration Guide Created
**File:** `MIGRATION_GUIDE.md` (NEW)

Comprehensive guide including:
- Schema changes comparison
- API changes with examples
- Setup instructions
- Database migration scripts
- Testing procedures
- Troubleshooting tips

### 13. ✅ Test Script Created
**File:** `test-email.js` (NEW)

- Quick email service testing
- Tests both OTP and confirmation emails
- Validates Brevo configuration
- Usage: `node test-email.js your-email@example.com`

---

## 🔐 Security Features Maintained

✅ OTP hashing (SHA-256) before storage  
✅ 5-minute OTP expiration  
✅ Maximum 5 verification attempts  
✅ Rate limiting on auth endpoints  
✅ Email validation and normalization  
✅ JWT authentication unchanged  
✅ MongoDB TTL index for automatic OTP cleanup  

---

## 📊 API Contract Changes

### Registration
```diff
POST /api/auth/register
{
  "fullName": "John Doe",
  "dateOfBirth": "1990-01-01",
- "phoneNumber": "+233201234567"
+ "email": "john.doe@example.com"
}
```

### Verify OTP
```diff
POST /api/auth/verify-otp
{
- "phoneNumber": "+233201234567",
+ "email": "john.doe@example.com",
  "otpCode": "123456"
}
```

### Resend OTP
```diff
POST /api/auth/resend-otp
{
- "phoneNumber": "+233201234567"
+ "email": "john.doe@example.com"
}
```

### Login (No Change)
```json
POST /api/auth/login
{
  "nhisNumber": "NHIS-123456",
  "dateOfBirth": "1990-01-01"
}
```

---

## 🚀 Next Steps

### Backend (Complete ✅)
- [x] Update User model
- [x] Update OTP model
- [x] Create email service
- [x] Update OTP service
- [x] Update auth controller
- [x] Update appointment controller
- [x] Update validators
- [x] Update environment config
- [x] Install dependencies
- [x] Delete SMS service
- [x] Update documentation

### Frontend (Pending ⏳)
- [ ] Update registration form (phone → email)
- [ ] Update verify OTP form
- [ ] Update resend OTP logic
- [ ] Update validation schemas (Zod)
- [ ] Update auth store
- [ ] Update API client calls
- [ ] Update UI text/labels

### Testing (Recommended 🧪)
- [ ] Test email delivery with Brevo
- [ ] Test registration flow
- [ ] Test OTP verification
- [ ] Test OTP resend
- [ ] Test appointment booking
- [ ] Test error handling
- [ ] Load testing

### Deployment (Future 🚀)
- [ ] Set up Brevo account
- [ ] Configure production environment variables
- [ ] Test email delivery in production
- [ ] Monitor email delivery rates
- [ ] Set up email templates in Brevo dashboard (optional)

---

## 📧 Brevo Setup Instructions

1. **Sign up:** https://www.brevo.com (Free tier: 300 emails/day)
2. **Verify email:** Check your inbox and verify your account
3. **Get credentials:**
   - Go to Settings → SMTP & API
   - Copy your **Login** (email address)
   - Copy your **Master Password** (API key)
4. **Update .env:**
   ```env
   BREVO_SMTP_USER=your-email@example.com
   BREVO_SMTP_PASS=your-api-key-here
   ```
5. **Test:** Run `node test-email.js your-test-email@example.com`

---

## 🧪 Testing the Changes

### 1. Test Email Service
```bash
node test-email.js your-email@example.com
```

### 2. Test Registration API
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "dateOfBirth": "1990-01-01",
    "email": "test@example.com"
  }'
```

### 3. Check Email
- Check inbox for OTP email
- Note the 6-digit code

### 4. Test OTP Verification
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otpCode": "123456"
  }'
```

### 5. Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "nhisNumber": "NHIS-XXXXXX",
    "dateOfBirth": "1990-01-01"
  }'
```

---

## 📈 Benefits of Email OTP

| Feature | SMS | Email |
|---------|-----|-------|
| **Cost** | $0.01-0.10 per message | Free (300/day on Brevo) |
| **Delivery Speed** | 1-5 seconds | 1-10 seconds |
| **Formatting** | Plain text only | HTML with styling |
| **Testing** | Requires real phone | Easy with any email |
| **Reliability** | Carrier dependent | High (99%+) |
| **Spam Issues** | Rare | Check spam folder |
| **Global Reach** | Country restrictions | Universal |

---

## ⚠️ Breaking Changes

1. **API endpoints changed** - All auth endpoints now use `email` instead of `phoneNumber`
2. **Database schema changed** - Existing data needs migration
3. **Frontend must be updated** - Phone inputs → Email inputs
4. **Environment variables changed** - Brevo config required

---

## 🎉 Summary

✅ **Backend refactoring complete**  
✅ **All SMS dependencies removed**  
✅ **Email service fully implemented**  
✅ **Security features maintained**  
✅ **Documentation updated**  
✅ **Test scripts provided**  

**Status:** Ready for frontend integration and testing! 🚀

---

## 📞 Support

For issues or questions:
1. Check `MIGRATION_GUIDE.md` for detailed instructions
2. Review `README_BACKEND.md` for API documentation
3. Run `node test-email.js` to verify email configuration
4. Check server logs for error details

---

**Refactoring completed successfully! 🎊**
