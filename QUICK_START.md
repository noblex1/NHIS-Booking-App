# 🚀 Quick Start Guide - Email OTP System

## Prerequisites

- Node.js (v14+)
- MongoDB (running locally or remote)
- Brevo account (free tier available)

---

## Step 1: Get Brevo Credentials (5 minutes)

1. **Sign up:** Visit https://www.brevo.com and create a free account
2. **Verify your email:** Check your inbox and click the verification link
3. **Get SMTP credentials:**
   - Login to Brevo dashboard
   - Navigate to: **Settings** → **SMTP & API**
   - Find the **SMTP** section
   - Copy your **Login** (this is your email)
   - Click **Generate a new SMTP key** or use existing one
   - Copy the **SMTP key** (this is your password)

**Free Tier Limits:**
- 300 emails per day
- Perfect for development and small projects

---

## Step 2: Configure Environment Variables

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file:**
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/nhis_booking

   JWT_SECRET=your-super-secret-key-change-this-in-production
   JWT_EXPIRES_IN=7d

   OTP_EXPIRY_MINUTES=5
   OTP_LENGTH=6
   OTP_MAX_ATTEMPTS=5

   # Brevo Configuration (REQUIRED)
   BREVO_SMTP_USER=your-brevo-email@example.com
   BREVO_SMTP_PASS=your-brevo-smtp-key-here
   EMAIL_FROM_NAME=NHIS Appointment System
   ```

3. **Important:** Replace these values:
   - `JWT_SECRET` - Use a strong random string
   - `BREVO_SMTP_USER` - Your Brevo login email
   - `BREVO_SMTP_PASS` - Your Brevo SMTP key (not your account password!)

---

## Step 3: Install Dependencies

```bash
npm install
```

This will install:
- express, mongoose, nodemailer
- JWT, validation, security packages
- All required dependencies

---

## Step 4: Start MongoDB

**Option A: Local MongoDB**
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# or
mongod --dbpath /path/to/data
```

**Option B: MongoDB Atlas (Cloud)**
- Update `MONGODB_URI` in `.env` with your Atlas connection string

---

## Step 5: Test Email Service (Optional but Recommended)

```bash
node test-email.js your-email@example.com
```

**Expected output:**
```
🧪 Testing Brevo Email Service

Configuration:
  SMTP User: your-email@example.com
  Test Email: your-email@example.com

📧 Test 1: Sending OTP email...
✅ OTP email sent successfully!

📧 Test 2: Sending appointment confirmation email...
✅ Appointment confirmation email sent successfully!

🎉 All tests passed!

📬 Check your inbox at your-email@example.com
```

**If test fails:**
- Verify Brevo credentials are correct
- Check your internet connection
- Ensure Brevo account is active
- Check spam/junk folder

---

## Step 6: Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

**Expected output:**
```
NHIS backend running on port 5000
```

---

## Step 7: Test the API

### 1. Health Check
```bash
curl http://localhost:5000/health
```

**Response:**
```json
{
  "success": true,
  "message": "NHIS Appointment Booking API is healthy",
  "timestamp": "2026-04-26T..."
}
```

### 2. Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "dateOfBirth": "1990-01-01",
    "email": "john.doe@example.com"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to your email"
}
```

### 3. Check Your Email
- Open your email inbox
- Look for email from "NHIS Appointment System"
- Copy the 6-digit OTP code
- **Note:** Check spam/junk folder if not in inbox

### 4. Verify OTP
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "otpCode": "123456"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "nhisNumber": "NHIS-123456",
    "dateOfBirth": "1990-01-01T00:00:00.000Z",
    "isVerified": true
  }
}
```

### 5. Login (After Registration)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "nhisNumber": "NHIS-123456",
    "dateOfBirth": "1990-01-01"
  }'
```

### 6. Get Available Slots
```bash
curl "http://localhost:5000/api/appointments/available?date=2026-05-15"
```

### 7. Book Appointment (Requires JWT Token)
```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "date": "2026-05-15",
    "timeSlot": "10:30 AM"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment booked successfully",
  "appointment": {
    "_id": "...",
    "userId": "...",
    "date": "2026-05-15T00:00:00.000Z",
    "timeSlot": "10:30 AM",
    "status": "Confirmed"
  }
}
```

**Note:** You'll also receive a confirmation email!

---

## 🎯 API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | No | Health check |
| POST | `/api/auth/register` | No | Register with email |
| POST | `/api/auth/verify-otp` | No | Verify OTP code |
| POST | `/api/auth/resend-otp` | No | Resend OTP |
| POST | `/api/auth/login` | No | Login with NHIS + DOB |
| GET | `/api/appointments/available` | No | Get available slots |
| POST | `/api/appointments` | Yes | Book appointment |
| GET | `/api/appointments` | Yes | Get user's appointments |

---

## 🐛 Troubleshooting

### Server won't start
- ✅ Check if MongoDB is running
- ✅ Verify `.env` file exists and is configured
- ✅ Run `npm install` to ensure dependencies are installed
- ✅ Check if port 5000 is available

### Email not sending
- ✅ Verify Brevo credentials in `.env`
- ✅ Check Brevo account is active and verified
- ✅ Run `node test-email.js` to test email service
- ✅ Check server logs for error messages
- ✅ Ensure port 587 is not blocked by firewall

### OTP not received
- ✅ Check spam/junk folder
- ✅ Verify email address is correct
- ✅ Check Brevo dashboard for delivery status
- ✅ Wait a few minutes (sometimes delayed)

### "Invalid or expired OTP" error
- ✅ OTP expires after 5 minutes - request a new one
- ✅ Maximum 5 attempts per OTP
- ✅ Ensure you're using the latest OTP code
- ✅ Check for typos in the code

### MongoDB connection error
- ✅ Ensure MongoDB is running
- ✅ Check `MONGODB_URI` in `.env`
- ✅ Verify MongoDB port (default: 27017)
- ✅ Check MongoDB logs for errors

---

## 📚 Next Steps

1. **Frontend Integration:**
   - Update registration form to use email
   - Update API calls to match new endpoints
   - See `MIGRATION_GUIDE.md` for details

2. **Production Deployment:**
   - Set strong `JWT_SECRET`
   - Use production MongoDB (MongoDB Atlas)
   - Configure proper CORS settings
   - Set up monitoring and logging
   - Consider rate limiting adjustments

3. **Additional Features:**
   - Add appointment cancellation
   - Add appointment rescheduling
   - Add email notifications for reminders
   - Add admin dashboard

---

## 📖 Documentation

- **API Details:** See `README_BACKEND.md`
- **Migration Guide:** See `MIGRATION_GUIDE.md`
- **Full Summary:** See `REFACTORING_SUMMARY.md`

---

## 🎉 You're All Set!

Your NHIS Appointment System backend is now running with email-based OTP verification!

**Test the complete flow:**
1. Register → Receive OTP email
2. Verify OTP → Get JWT token
3. Login → Access protected routes
4. Book appointment → Receive confirmation email

**Happy coding! 🚀**
