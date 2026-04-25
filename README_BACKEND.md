# NHIS Backend

## Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT auth
- OTP verification
- SMS via Twilio or Hubtel

## Setup
1. Copy `.env.example` to `.env`
2. Install dependencies:
   - `npm install`
3. Start server:
   - `npm run dev`

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/verify-otp`
- `POST /api/auth/resend-otp`
- `POST /api/auth/login`

### Appointments
- `GET /api/appointments/available?date=YYYY-MM-DD`
- `POST /api/appointments` (JWT required)
- `GET /api/appointments` (JWT required)

### Health
- `GET /health`
