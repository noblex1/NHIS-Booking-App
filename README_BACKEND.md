# NHIS Backend

## Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT auth
- OTP verification via Email
- Email service via Brevo (Sendinblue)

## Setup
1. Copy `.env.example` to `.env`
2. Configure Brevo credentials:
   - Sign up at https://www.brevo.com
   - Get your SMTP credentials from Settings > SMTP & API
   - Update `BREVO_SMTP_USER` and `BREVO_SMTP_PASS` in `.env`
3. Install dependencies:
   - `npm install`
4. Start server:
   - `npm run dev`

## API Endpoints

### Auth
- `POST /api/auth/register` - Register with email, fullName, dateOfBirth
- `POST /api/auth/verify-otp` - Verify OTP sent to email
- `POST /api/auth/resend-otp` - Resend OTP to email
- `POST /api/auth/login` - Login with NHIS number and dateOfBirth

### Appointments
- `GET /api/appointments/available?date=YYYY-MM-DD` - Get available time slots
- `POST /api/appointments` - Book appointment (JWT required)
- `GET /api/appointments` - Get user's appointments (JWT required)

### Health
- `GET /health` - Health check endpoint

## Email Configuration

The system uses Brevo (formerly Sendinblue) for sending emails:

### Required Environment Variables:
- `BREVO_SMTP_USER` - Your Brevo login email
- `BREVO_SMTP_PASS` - Your Brevo API key (not your password)
- `EMAIL_FROM_NAME` - Display name for emails (default: "NHIS Appointment System")

### Email Types:
1. **OTP Verification** - Sent during registration
2. **Appointment Confirmation** - Sent after booking

## Authentication Flow

1. User registers with email, fullName, and dateOfBirth
2. System sends OTP to email via Brevo
3. User verifies OTP
4. System generates unique NHIS number and JWT token
5. User can login with NHIS number and dateOfBirth
