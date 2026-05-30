# Profile Features Quick Start Guide

## 🚀 Getting Started

This guide will help you quickly test and use the new profile features.

## Prerequisites

1. **Backend Running**: Ensure the backend server is running on port 5000
2. **Frontend Running**: Ensure the frontend is running on port 5173 (or configured port)
3. **Database**: MongoDB connection is active
4. **Email Service**: Brevo/SendGrid is configured for OTP emails
5. **User Account**: You have a registered and verified user account

## Environment Variables

Ensure these are set in your `.env` file:

```env
# Backend (.env)
JWT_SECRET=your_jwt_secret_here
OTP_EXPIRY_MINUTES=10
OTP_MAX_ATTEMPTS=5

# Email Service (Brevo)
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=noreply@nhis.gov.gh
BREVO_SENDER_NAME=NHIS Booking System

# Database
MONGODB_URI=mongodb://localhost:27017/nhis_booking
```

## Starting the Application

### Backend
```bash
# From project root
npm start
# or
node server.js
```

### Frontend
```bash
# From client directory
cd client
npm run dev
```

## Testing Each Feature

### 1. Change Password with OTP

**Steps:**
1. Login to your account
2. Navigate to Profile page
3. Click "Change Password"
4. Click "Send Verification Code"
5. Check your email for the 6-digit OTP
6. Enter the OTP code
7. Enter new password (min 6 characters)
8. Confirm the password
9. Click "Change Password"
10. Verify success message and redirect to profile

**Expected Results:**
- ✅ OTP email received within 1 minute
- ✅ Valid OTP allows password change
- ✅ Invalid OTP shows error
- ✅ Password must match confirmation
- ✅ Success toast notification appears
- ✅ Redirected to profile page
- ✅ Can login with new password

**Test Cases:**
```bash
# Test 1: Valid OTP
- Request OTP
- Enter correct 6-digit code
- Enter new password: "newpass123"
- Confirm password: "newpass123"
- Should succeed ✅

# Test 2: Invalid OTP
- Request OTP
- Enter wrong code: "000000"
- Should show error ❌

# Test 3: Password Mismatch
- Request OTP
- Enter valid OTP
- New password: "password1"
- Confirm: "password2"
- Should show error ❌

# Test 4: Short Password
- Request OTP
- Enter valid OTP
- New password: "pass"
- Should show error (min 6 chars) ❌

# Test 5: Resend OTP
- Request OTP
- Click "Resend Code"
- Should receive new OTP ✅
```

---

### 2. Notification Preferences

**Steps:**
1. Login to your account
2. Navigate to Profile page
3. Click "Notifications"
4. Toggle notification preferences
5. Click "Save Preferences"
6. Verify success message
7. Refresh page to confirm persistence

**Expected Results:**
- ✅ Preferences load from backend
- ✅ Default preferences for new users
- ✅ Toggle switches work smoothly
- ✅ Save button persists changes
- ✅ Success toast notification
- ✅ Preferences persist after refresh

**Test Cases:**
```bash
# Test 1: Load Preferences
- Navigate to notifications page
- Should show current preferences ✅

# Test 2: Update Preferences
- Toggle "Email Notifications" OFF
- Toggle "Promotions" ON
- Click "Save Preferences"
- Should show success message ✅

# Test 3: Persistence
- Update preferences
- Save changes
- Refresh page
- Should show updated preferences ✅

# Test 4: Default Preferences (New User)
- Create new user account
- Navigate to notifications
- Should show defaults:
  - Email Notifications: ON
  - Appointment Reminders: ON
  - Status Updates: ON
  - Promotions: OFF ✅
```

---

### 3. Help Center

**Steps:**
1. Login to your account
2. Navigate to Profile page
3. Click "Help Center"
4. Test search functionality
5. Expand FAQ items
6. Check contact cards

**Expected Results:**
- ✅ All 8 FAQs displayed
- ✅ Search filters FAQs
- ✅ Accordion expands/collapses
- ✅ Contact cards visible
- ✅ Mobile responsive

**Test Cases:**
```bash
# Test 1: View FAQs
- Navigate to help center
- Should see 8 FAQ items ✅

# Test 2: Search FAQs
- Type "book" in search
- Should filter to booking-related FAQs ✅

# Test 3: Expand FAQ
- Click on any FAQ question
- Should expand to show answer ✅

# Test 4: Contact Cards
- Should see Email, Phone, Chat cards ✅

# Test 5: No Results
- Search for "xyz123"
- Should show "No results found" ✅
```

---

### 4. Terms & Privacy

**Steps:**
1. Login to your account
2. Navigate to Profile page
3. Click "Terms & Privacy"
4. Switch between tabs
5. Scroll through content

**Expected Results:**
- ✅ Both tabs load correctly
- ✅ Content is formatted properly
- ✅ Navigation works smoothly
- ✅ Mobile responsive

**Test Cases:**
```bash
# Test 1: View Terms
- Navigate to Terms & Privacy
- Should show Terms of Service tab ✅

# Test 2: Switch to Privacy
- Click "Privacy Policy" tab
- Should show privacy content ✅

# Test 3: Content Sections
- Terms should have 9 sections ✅
- Privacy should have 10 sections ✅

# Test 4: Last Updated Date
- Should show "Last updated: May 30, 2026" ✅
```

---

## API Testing with cURL

### Test Password Change OTP Request
```bash
# Get auth token first (login)
TOKEN="your_jwt_token_here"

# Request OTP
curl -X POST http://localhost:5000/api/auth/request-password-change-otp \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

# Expected Response:
# {
#   "success": true,
#   "message": "OTP sent to your email"
# }
```

### Test Change Password
```bash
# Change password with OTP
curl -X POST http://localhost:5000/api/auth/change-password \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "otp": "123456",
    "newPassword": "newpassword123"
  }'

# Expected Response:
# {
#   "success": true,
#   "message": "Password changed successfully"
# }
```

### Test Get Notification Preferences
```bash
# Get preferences
curl -X GET http://localhost:5000/api/notifications/preferences \
  -H "Authorization: Bearer $TOKEN"

# Expected Response:
# {
#   "success": true,
#   "preferences": {
#     "_id": "...",
#     "userId": "...",
#     "emailNotifications": true,
#     "appointmentReminders": true,
#     "statusUpdates": true,
#     "promotions": false,
#     "createdAt": "...",
#     "updatedAt": "..."
#   }
# }
```

### Test Update Notification Preferences
```bash
# Update preferences
curl -X PUT http://localhost:5000/api/notifications/preferences \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "emailNotifications": true,
    "appointmentReminders": false,
    "statusUpdates": true,
    "promotions": true
  }'

# Expected Response:
# {
#   "success": true,
#   "message": "Notification preferences updated successfully",
#   "preferences": { ... }
# }
```

---

## Common Issues & Solutions

### Issue 1: OTP Email Not Received
**Symptoms:** User doesn't receive OTP email

**Solutions:**
1. Check email service configuration (Brevo API key)
2. Verify sender email is configured
3. Check spam/junk folder
4. Verify email service logs
5. Test email service separately

```bash
# Test email service
node diagnose-email.js
```

### Issue 2: Invalid Token Error
**Symptoms:** "Invalid or expired token" error

**Solutions:**
1. Ensure user is logged in
2. Check JWT_SECRET is set
3. Verify token is not expired
4. Clear localStorage and login again

```javascript
// Clear auth in browser console
localStorage.removeItem('nhis_auth_token');
localStorage.removeItem('nhis_state_v2');
```

### Issue 3: Preferences Not Saving
**Symptoms:** Preferences reset after refresh

**Solutions:**
1. Check MongoDB connection
2. Verify API endpoint is working
3. Check browser console for errors
4. Verify authentication token

### Issue 4: OTP Expired
**Symptoms:** "Invalid or expired OTP" error

**Solutions:**
1. Request new OTP (click "Resend Code")
2. Check OTP_EXPIRY_MINUTES setting (default 10 min)
3. Use OTP within expiry time

### Issue 5: Rate Limit Exceeded
**Symptoms:** "Too many requests" error

**Solutions:**
1. Wait a few minutes before retrying
2. Check rate limit configuration
3. Verify you're not spamming requests

---

## Browser Console Testing

### Check Authentication
```javascript
// In browser console
const token = localStorage.getItem('nhis_auth_token');
console.log('Token:', token);

const state = localStorage.getItem('nhis_state_v2');
console.log('State:', JSON.parse(state));
```

### Test API Calls
```javascript
// Test get preferences
fetch('http://localhost:5000/api/notifications/preferences', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('nhis_auth_token')}`
  }
})
.then(r => r.json())
.then(console.log);
```

---

## Mobile Testing

### Test on Different Devices
1. **iPhone (Safari)**
   - Test touch interactions
   - Verify bottom navigation
   - Check form inputs

2. **Android (Chrome)**
   - Test toggle switches
   - Verify OTP input
   - Check responsive layout

3. **Tablet (iPad)**
   - Test landscape/portrait
   - Verify spacing
   - Check navigation

### Responsive Breakpoints
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

---

## Performance Testing

### Load Time Metrics
- Profile page: < 1s
- Notifications page: < 1.5s (includes API call)
- Help center: < 1s
- Terms & privacy: < 1s

### API Response Times
- Request OTP: < 2s
- Change password: < 1s
- Get preferences: < 500ms
- Update preferences: < 1s

---

## Security Testing

### Test Authentication
```bash
# Test without token (should fail)
curl -X POST http://localhost:5000/api/auth/request-password-change-otp

# Expected: 401 Unauthorized
```

### Test Rate Limiting
```bash
# Send multiple OTP requests rapidly
for i in {1..10}; do
  curl -X POST http://localhost:5000/api/auth/request-password-change-otp \
    -H "Authorization: Bearer $TOKEN"
done

# Should get rate limited after a few requests
```

### Test Input Validation
```bash
# Test invalid OTP format
curl -X POST http://localhost:5000/api/auth/change-password \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "otp": "abc",
    "newPassword": "test"
  }'

# Expected: Validation error
```

---

## Monitoring & Logs

### Backend Logs
```bash
# Watch backend logs
tail -f logs/app.log

# Look for:
# - OTP generation
# - Email sending
# - Password changes
# - Preference updates
```

### Frontend Console
```javascript
// Enable debug mode
localStorage.setItem('debug', 'true');

// Check for errors
console.log('Errors:', window.errors);
```

---

## Success Checklist

Before considering the feature complete, verify:

- [ ] All API endpoints respond correctly
- [ ] OTP emails are delivered
- [ ] Password change works end-to-end
- [ ] Notification preferences persist
- [ ] Help center search works
- [ ] Terms & privacy display correctly
- [ ] Mobile responsive on all pages
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Authentication works properly
- [ ] Rate limiting is active
- [ ] Input validation works
- [ ] Error messages are clear
- [ ] Success messages appear
- [ ] Loading states show correctly

---

## Next Steps

1. ✅ Complete all test cases
2. ✅ Fix any issues found
3. ✅ Test on multiple browsers
4. ✅ Test on mobile devices
5. ✅ Verify email delivery
6. ✅ Check performance metrics
7. ✅ Review security measures
8. ✅ Deploy to staging
9. ✅ User acceptance testing
10. ✅ Deploy to production

---

## Support

If you encounter any issues:
1. Check this guide first
2. Review the implementation summary
3. Check backend logs
4. Check browser console
5. Test API endpoints directly
6. Contact the development team

---

## Resources

- **Implementation Summary**: `PROFILE_FEATURES_IMPLEMENTATION.md`
- **Visual Guide**: `PROFILE_FEATURES_VISUAL_GUIDE.md`
- **API Documentation**: Check backend routes
- **Component Library**: Shadcn/ui docs
- **Email Service**: Brevo documentation

---

Happy Testing! 🚀
