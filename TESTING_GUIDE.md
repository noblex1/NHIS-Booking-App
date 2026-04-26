# 🧪 Complete Testing Guide

## Prerequisites

Before testing, ensure:
- ✅ Backend is running on port 5000
- ✅ Frontend is running on port 5173
- ✅ MongoDB is connected
- ✅ Brevo credentials are configured
- ✅ You have a real email address to test with

---

## 🚀 Quick Start

### 1. Start Backend
```bash
npm run dev
```

### 2. Start Frontend
```bash
cd client
npm run dev
```

### 3. Open Browser
```
http://localhost:5173
```

---

## 📋 Test Scenarios

### Scenario 1: Complete User Journey (Happy Path)

#### Step 1: Registration
1. Go to http://localhost:5173
2. Click "Register"
3. Fill in the form:
   - Full Name: `John Doe`
   - Date of Birth: `1990-01-01`
   - Email: `your-real-email@example.com`
4. Click "Send Verification Code"

**Expected:**
- ✅ Success toast: "OTP sent to your email"
- ✅ Redirected to `/verify` page
- ✅ Email received with 6-digit OTP

#### Step 2: Verify OTP
1. Check your email for OTP code
2. Enter the 6-digit code
3. Click "Verify and Continue"

**Expected:**
- ✅ Success toast with NHIS number (e.g., "Account verified! Your NHIS #: NHIS-123456")
- ✅ Redirected to `/dashboard`
- ✅ User is logged in

#### Step 3: View Dashboard
**Expected:**
- ✅ Welcome message with your name
- ✅ NHIS number displayed
- ✅ Email address displayed
- ✅ Statistics cards (Upcoming: 0, Total visits: 0, Coverage: Active)
- ✅ Action cards for booking and viewing appointments

#### Step 4: Book Appointment
1. Click "Book Appointment" card
2. Select a future date (not Sunday)
3. Wait for slots to load

**Expected:**
- ✅ Available time slots appear
- ✅ Some slots may be unavailable (crossed out)

4. Select an available time slot
5. Click "Confirm Appointment"
6. In the modal, click "Confirm"

**Expected:**
- ✅ Loading spinner appears
- ✅ Success modal: "Appointment Confirmed"
- ✅ Confirmation email sent to your email
- ✅ Success toast

7. Click "View Appointments"

#### Step 5: View Appointments
**Expected:**
- ✅ Your booked appointment appears in the list
- ✅ Shows correct date and time
- ✅ Status badge: "Confirmed"
- ✅ Cancel button available

#### Step 6: Logout
1. Click "Logout" in header

**Expected:**
- ✅ Success toast: "Logged out successfully"
- ✅ Redirected to home page
- ✅ Header shows "Login" and "Register" buttons

#### Step 7: Login
1. Click "Login"
2. Enter:
   - NHIS Number: (from registration, e.g., `NHIS-123456`)
   - Date of Birth: `1990-01-01`
3. Click "Login"

**Expected:**
- ✅ Success toast: "Welcome back!"
- ✅ Redirected to dashboard
- ✅ All your data is still there

---

### Scenario 2: Error Handling

#### Test 1: Invalid Email Format
1. Go to register page
2. Enter invalid email: `notanemail`
3. Try to submit

**Expected:**
- ✅ Validation error: "Enter a valid email address"

#### Test 2: Duplicate Email
1. Try to register with the same email again

**Expected:**
- ✅ Error toast: "User already exists. Please login."

#### Test 3: Invalid OTP
1. Start registration
2. On verify page, enter wrong code: `000000`

**Expected:**
- ✅ Error toast: "Invalid or expired OTP"
- ✅ OTP inputs cleared

#### Test 4: Expired OTP
1. Start registration
2. Wait 5+ minutes
3. Try to verify

**Expected:**
- ✅ Error toast: "Invalid or expired OTP"

#### Test 5: Invalid Login Credentials
1. Go to login page
2. Enter wrong NHIS number or DOB

**Expected:**
- ✅ Error toast: "Invalid NHIS number or DOB"

#### Test 6: Slot Already Booked
1. Book an appointment
2. Try to book the same slot again (use another account or browser)

**Expected:**
- ✅ Error toast: "Time slot already booked"
- ✅ Slots refresh automatically

---

### Scenario 3: OTP Resend

1. Start registration
2. On verify page, wait for timer to reach 0
3. Click "Resend code"

**Expected:**
- ✅ Success toast: "OTP resent successfully"
- ✅ New email received
- ✅ Timer resets to 60 seconds

---

### Scenario 4: Protected Routes

1. Logout if logged in
2. Try to access:
   - http://localhost:5173/dashboard
   - http://localhost:5173/book
   - http://localhost:5173/appointments

**Expected:**
- ✅ Redirected to `/login` page

---

### Scenario 5: Multiple Appointments

1. Login
2. Book multiple appointments on different dates
3. Go to appointments page

**Expected:**
- ✅ All appointments listed
- ✅ Sorted by date (newest first)
- ✅ Each shows correct date, time, and status

---

### Scenario 6: Cancel Appointment

1. Go to appointments page
2. Click "Cancel" on a confirmed appointment

**Expected:**
- ✅ Loading spinner on button
- ✅ Success toast: "Appointment cancelled"
- ✅ Status changes to "Cancelled"
- ✅ Cancel button disappears

---

## 🔍 What to Check

### Backend Logs
Monitor the backend terminal for:
- API requests
- Email sending status
- Errors

### Frontend Console
Open DevTools (F12) and check:
- Network tab for API calls
- Console for errors
- Application → Local Storage for token

### Email Inbox
Check for:
- OTP verification emails
- Appointment confirmation emails
- Check spam folder if not in inbox

---

## 📊 Expected API Calls

### Registration Flow
```
POST /api/auth/register
  → 200 OK
  → Email sent

POST /api/auth/verify-otp
  → 200 OK
  → Token returned
```

### Login Flow
```
POST /api/auth/login
  → 200 OK
  → Token returned
```

### Dashboard Load
```
GET /api/appointments
  → 200 OK
  → Appointments array returned
```

### Book Appointment
```
GET /api/appointments/available?date=2026-05-15
  → 200 OK
  → Available slots returned

POST /api/appointments
  → 201 Created
  → Appointment object returned
  → Email sent
```

---

## 🐛 Troubleshooting

### "Network error"
- ✅ Check backend is running
- ✅ Check `VITE_API_BASE_URL` in `client/.env`
- ✅ Check browser console for CORS errors

### "Email not received"
- ✅ Check spam/junk folder
- ✅ Check backend logs for email errors
- ✅ Verify Brevo credentials
- ✅ Check Brevo dashboard

### "Token not persisting"
- ✅ Check browser Local Storage
- ✅ Look for `nhis_auth_token` key
- ✅ Clear cache and try again

### "Slots not loading"
- ✅ Check backend is running
- ✅ Check network tab for API call
- ✅ Check backend logs for errors

### "Appointment not saving"
- ✅ Check backend logs
- ✅ Verify MongoDB connection
- ✅ Check for validation errors

---

## ✅ Testing Checklist

### Authentication
- [ ] Register with email
- [ ] Receive OTP email
- [ ] Verify OTP successfully
- [ ] Get NHIS number
- [ ] Resend OTP works
- [ ] Login with NHIS number
- [ ] Logout works
- [ ] Session persists on refresh

### Dashboard
- [ ] Loads appointments
- [ ] Shows correct statistics
- [ ] Displays user info
- [ ] Navigation works

### Book Appointment
- [ ] Date selection works
- [ ] Slots load for selected date
- [ ] Can select available slot
- [ ] Booking succeeds
- [ ] Confirmation email received
- [ ] Success modal appears
- [ ] Appointment appears in list

### View Appointments
- [ ] Lists all appointments
- [ ] Shows correct details
- [ ] Cancel works
- [ ] Empty state shows when no appointments

### Error Handling
- [ ] Invalid email shows error
- [ ] Duplicate email shows error
- [ ] Invalid OTP shows error
- [ ] Invalid login shows error
- [ ] Slot conflict handled
- [ ] Network errors handled

### UI/UX
- [ ] Loading states appear
- [ ] Success toasts show
- [ ] Error toasts show
- [ ] Empty states display
- [ ] Responsive on mobile
- [ ] Responsive on tablet
- [ ] Responsive on desktop

---

## 📈 Performance Checks

### Page Load Times
- Dashboard: < 2 seconds
- Book page: < 2 seconds
- Appointments page: < 2 seconds

### API Response Times
- Register: < 1 second
- Verify OTP: < 1 second
- Login: < 1 second
- Get appointments: < 500ms
- Get available slots: < 500ms
- Book appointment: < 1 second

---

## 🎯 Success Criteria

You know everything is working when:

1. ✅ You can register with your email
2. ✅ You receive OTP email within 10 seconds
3. ✅ You can verify OTP and get NHIS number
4. ✅ You can login with NHIS number
5. ✅ Dashboard loads your appointments
6. ✅ You can see available time slots
7. ✅ You can book an appointment
8. ✅ You receive confirmation email
9. ✅ Appointment appears in your list
10. ✅ You can logout and login again

---

## 📞 Need Help?

### Check Logs
- Backend terminal for API errors
- Browser console for frontend errors
- Network tab for failed requests

### Documentation
- `COMPLETE_SETUP_GUIDE.md` - Setup instructions
- `FRONTEND_BACKEND_CONNECTED.md` - Integration details
- `README_BACKEND.md` - API documentation

### Test Scripts
```bash
# Test email service
node test-email.js your-email@example.com

# Test backend health
curl http://localhost:5000/health
```

---

## 🎉 Happy Testing!

Follow this guide step by step to ensure everything works correctly. Report any issues you find!

**Good luck! 🚀**
