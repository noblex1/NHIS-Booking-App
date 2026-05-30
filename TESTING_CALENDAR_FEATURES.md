# Testing Calendar Features - Quick Start Guide

## 🧪 Test Scenarios

### Test 1: Weekend Blocking ✅

**Objective:** Verify that Saturdays and Sundays are automatically blocked

**Steps:**
1. Navigate to `/book` (booking page)
2. Open the calendar
3. Try to click on any Saturday or Sunday

**Expected Result:**
- Weekend dates should be grayed out/disabled
- Clicking them should have no effect
- Cursor should show "not-allowed" icon

**Test Dates (March 2026):**
- Saturday: March 7, 14, 21, 28
- Sunday: March 1, 8, 15, 22, 29

---

### Test 2: Public Holiday Blocking ✅

**Objective:** Verify that Ghana public holidays are automatically blocked

**Steps:**
1. Navigate to `/book` (booking page)
2. Open the calendar to March 2026
3. Try to click on March 6 (Independence Day)

**Expected Result:**
- March 6 should be disabled (cannot select)
- Date should appear grayed out like weekends

**Test Dates (2026):**
- January 1 - New Year's Day
- January 7 - Constitution Day
- March 6 - Independence Day
- April 3 - Good Friday
- April 6 - Easter Monday
- May 1 - May Day
- December 25 - Christmas Day

---

### Test 3: Admin Holiday Visualization ✅

**Objective:** Verify that holidays are highlighted in admin view

**Steps:**
1. Login as admin
2. Navigate to `/admin/availability`
3. View the calendar for March 2026
4. Observe March 6 (Independence Day)

**Expected Result:**
- March 6 should have amber/gold background color
- Legend should show color meanings
- Weekends should have different color than holidays

**Visual Check:**
- 🔴 Red = Admin blocked
- 🟡 Amber = Public holiday
- ⚪ Gray = Weekend
- 🟢 Green = Opened (override)

---

### Test 4: Holiday Information Display ✅

**Objective:** Verify that holiday details are shown when selected

**Steps:**
1. Login as admin
2. Navigate to `/admin/availability`
3. Click on March 6, 2026 (Independence Day)

**Expected Result:**
- Holiday banner should appear with:
  - 🇬🇭 emoji
  - Holiday name: "Independence Day"
  - Description: "Celebrates Ghana's independence from British colonial rule"
  - Note: "Ghana Public Holiday - automatically unavailable unless opened"

---

### Test 5: Admin Override - Open Holiday ✅

**Objective:** Verify that admin can override and open a holiday

**Steps:**
1. Login as admin
2. Navigate to `/admin/availability`
3. Click on March 6, 2026 (Independence Day)
4. Click "Open (e.g. Sunday)" button
5. Add note: "Special service day"
6. Set slot capacities (e.g., Morning: 10, Afternoon: 8, Evening: 5)
7. Click "Save slot limits"
8. Logout and go to `/book` as regular user
9. Check if March 6 is now selectable

**Expected Result:**
- Admin should be able to open the holiday
- Date should become available for booking
- Users should be able to select March 6
- Time slots should be available

---

### Test 6: Admin Override - Open Weekend ✅

**Objective:** Verify that admin can override and open a weekend

**Steps:**
1. Login as admin
2. Navigate to `/admin/availability`
3. Click on Saturday, March 7, 2026
4. Click "Open (e.g. Sunday)" button
5. Set slot capacities
6. Save changes
7. Check user booking page

**Expected Result:**
- Saturday should become available for booking
- Users can select the opened Saturday
- Time slots should be configurable

---

### Test 7: Past Date Blocking ✅

**Objective:** Verify that past dates cannot be selected

**Steps:**
1. Navigate to `/book`
2. View calendar for previous months
3. Try to select any past date

**Expected Result:**
- All past dates should be disabled
- Only future dates should be selectable
- Today and future dates should be available (if not weekend/holiday)

---

### Test 8: Combined Rules ✅

**Objective:** Verify that multiple rules work together correctly

**Test Matrix:**

| Date | Day | Holiday? | Admin Block? | Expected |
|------|-----|----------|--------------|----------|
| Mar 3 | Tue | No | No | ✅ Available |
| Mar 6 | Fri | Yes (Independence) | No | ❌ Blocked |
| Mar 7 | Sat | No | No | ❌ Blocked (weekend) |
| Mar 8 | Sun | No | No | ❌ Blocked (weekend) |
| Mar 10 | Tue | No | Yes | ❌ Blocked (admin) |
| Mar 20 | Fri | Yes (Eid) | No | ❌ Blocked (holiday) |

**Steps:**
1. Test each date in the matrix
2. Verify expected availability

---

### Test 9: Calendar Navigation ✅

**Objective:** Verify that holidays are detected across different months

**Steps:**
1. Navigate to `/book`
2. Change calendar month to January 2026
3. Check January 1 (New Year's Day) - should be blocked
4. Change to April 2026
5. Check April 3 (Good Friday) - should be blocked
6. Change to December 2026
7. Check December 25 (Christmas) - should be blocked

**Expected Result:**
- Holidays should be blocked in all months
- Calendar navigation should work smoothly
- Holiday detection should work for entire year

---

### Test 10: Mobile Responsiveness ✅

**Objective:** Verify that calendar works on mobile devices

**Steps:**
1. Open browser developer tools
2. Switch to mobile view (e.g., iPhone, Android)
3. Navigate to `/book`
4. Test calendar interaction
5. Try selecting dates
6. Check holiday blocking

**Expected Result:**
- Calendar should be responsive
- Touch interactions should work
- Disabled dates should be clear
- All features should work on mobile

---

## 🔍 Visual Inspection Checklist

### User Booking Page (`/book`):
- [ ] Calendar displays correctly
- [ ] Weekends are grayed out
- [ ] Holidays are grayed out
- [ ] Available dates are clickable
- [ ] Disabled dates show not-allowed cursor
- [ ] Past dates are disabled
- [ ] Time slots appear when date selected

### Admin Availability Page (`/admin/availability`):
- [ ] Calendar displays with colors
- [ ] Legend is visible and accurate
- [ ] Holidays have amber background
- [ ] Weekends have gray background
- [ ] Holiday banner appears when holiday selected
- [ ] Holiday name and description are correct
- [ ] "Open" and "Block" buttons work
- [ ] Slot capacity inputs work

---

## 🐛 Common Issues to Check

### Issue 1: Holiday Not Blocked
**Symptom:** Holiday date is selectable when it shouldn't be
**Check:**
- Is the date in `ghana-holidays.ts`?
- Is the year supported (2026-2027)?
- Is the date format correct (YYYY-MM-DD)?
- Check browser console for errors

### Issue 2: Weekend Not Blocked
**Symptom:** Saturday or Sunday is selectable
**Check:**
- Verify day of week calculation
- Check if date was explicitly opened by admin
- Look for override in database

### Issue 3: Holiday Not Highlighted in Admin
**Symptom:** Holiday doesn't show amber color
**Check:**
- CSS classes applied correctly?
- Calendar modifiers configured?
- Dark mode vs light mode styling

### Issue 4: Override Not Working
**Symptom:** Admin opens date but it's still blocked
**Check:**
- Was "Save" clicked?
- Check network request succeeded
- Refresh the page
- Check database for open date entry

---

## 📊 Test Data

### Known Holidays to Test (2026):

**Fixed Holidays:**
```
2026-01-01 - New Year's Day
2026-01-07 - Constitution Day
2026-03-06 - Independence Day
2026-05-01 - May Day
2026-07-01 - Republic Day
2026-09-21 - Founder's Day
2026-12-04 - Farmer's Day
2026-12-25 - Christmas Day
2026-12-26 - Boxing Day
```

**Movable Holidays:**
```
2026-03-20 - Eid ul-Fitr
2026-04-03 - Good Friday
2026-04-06 - Easter Monday
2026-05-27 - Eid al-Adha
```

**Observed Holidays:**
```
2026-01-09 - Day off for Constitution Day
2026-03-21 - Eid ul-Fitr Holiday
2026-03-23 - Day off for Eid ul-Fitr
2026-12-28 - Day off for Boxing Day
```

---

## 🎯 Acceptance Criteria

### Must Pass:
- ✅ All weekends blocked by default
- ✅ All public holidays blocked by default
- ✅ Past dates always disabled
- ✅ Admin can override weekends/holidays
- ✅ Holiday information displays correctly
- ✅ Calendar colors match legend
- ✅ No console errors
- ✅ Mobile responsive

### Should Pass:
- ✅ Fast calendar rendering
- ✅ Smooth month navigation
- ✅ Clear visual feedback
- ✅ Accessible (keyboard navigation)
- ✅ Works in all major browsers

---

## 🚀 Quick Test Script

Run this in browser console on `/book` page:

```javascript
// Test weekend detection
const testDate1 = new Date('2026-03-07'); // Saturday
console.log('Is Saturday blocked?', testDate1.getDay() === 6); // Should be true

// Test holiday detection
const testDate2 = new Date('2026-03-06'); // Independence Day
console.log('Is March 6 a holiday?', isGhanaPublicHoliday(testDate2)); // Should be true

// Test normal day
const testDate3 = new Date('2026-03-03'); // Tuesday
console.log('Is Tuesday a holiday?', isGhanaPublicHoliday(testDate3)); // Should be false
console.log('Is Tuesday a weekend?', testDate3.getDay() === 0 || testDate3.getDay() === 6); // Should be false
```

---

## 📝 Test Report Template

```
Test Date: _______________
Tester: _______________
Browser: _______________
Device: _______________

Test Results:
[ ] Test 1: Weekend Blocking - PASS / FAIL
[ ] Test 2: Holiday Blocking - PASS / FAIL
[ ] Test 3: Admin Visualization - PASS / FAIL
[ ] Test 4: Holiday Info Display - PASS / FAIL
[ ] Test 5: Override Holiday - PASS / FAIL
[ ] Test 6: Override Weekend - PASS / FAIL
[ ] Test 7: Past Date Blocking - PASS / FAIL
[ ] Test 8: Combined Rules - PASS / FAIL
[ ] Test 9: Calendar Navigation - PASS / FAIL
[ ] Test 10: Mobile Responsive - PASS / FAIL

Issues Found:
1. _______________
2. _______________
3. _______________

Overall Status: PASS / FAIL
Notes: _______________
```

---

**Testing Guide Version:** 1.0  
**Last Updated:** May 30, 2026  
**Status:** Ready for QA
