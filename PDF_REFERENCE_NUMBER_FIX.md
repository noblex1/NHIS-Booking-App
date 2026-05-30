# PDF Reference Number Fix - Summary

## Issue
The booking reference number was showing as blank in the PDF document.

## Root Cause
The backend might not be returning the `referenceNumber` field in some cases, or it might be undefined/null.

## Solution
Added fallback logic to display the appointment `_id` if `referenceNumber` is not available.

---

## Changes Made

### 1. ✅ **PDF Generation - Added Fallback**

**File:** `client/src/lib/appointment-pdf.ts`

```typescript
// Before:
doc.text(appointment.referenceNumber || "—", MARGIN + 7, layout.y + 15);

// After:
const displayReference = appointment.referenceNumber || appointment._id || "N/A";
doc.text(displayReference, MARGIN + 7, layout.y + 15);
```

**Result:**
- If `referenceNumber` exists → shows reference number (e.g., "NHIS-2026-001234")
- If `referenceNumber` is blank → shows appointment ID (e.g., "507f1f77bcf86cd799439011")
- If both are missing → shows "N/A"

---

### 2. ✅ **Appointments List - Always Show Reference**

**File:** `client/src/routes/appointments.tsx`

```typescript
// Before:
{apt.referenceNumber && (
  <p className="mt-0.5 font-mono text-xs text-primary">
    {apt.referenceNumber}
  </p>
)}

// After:
<p className="mt-0.5 font-mono text-xs text-primary">
  {apt.referenceNumber || `ID: ${apt._id.slice(-8)}`}
</p>
```

**Result:**
- If `referenceNumber` exists → shows full reference (e.g., "NHIS-2026-001234")
- If `referenceNumber` is blank → shows last 8 characters of ID (e.g., "ID: 99439011")

---

### 3. ✅ **Added Debug Logging**

**File:** `client/src/routes/appointments.tsx`

```typescript
const handleDownloadPdf = async (apt: Appointment) => {
  // Debug: Log appointment data
  console.log('Downloading PDF for appointment:', {
    _id: apt._id,
    referenceNumber: apt.referenceNumber,
    hasReferenceNumber: !!apt.referenceNumber
  });
  
  downloadAppointmentPdf(apt, {
    fullName: user.fullName,
    email: user.email,
  });
  // ...
};
```

**Purpose:**
- Helps diagnose if the backend is returning `referenceNumber`
- Check browser console when downloading PDF to see the data

---

## Testing

### To Test the Fix:

1. **View Appointments List:**
   - Go to `/appointments`
   - Check that each appointment shows a reference number or ID
   - Should never be blank

2. **Download PDF:**
   - Click "Download PDF" button
   - Open the PDF
   - Check the "BOOKING REFERENCE" section at the top
   - Should show either:
     - Full reference number (if available)
     - Appointment ID (if reference number is missing)

3. **Check Console:**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Download a PDF
   - Look for log message showing appointment data
   - Verify if `referenceNumber` is present or not

---

## Expected Behavior

### Scenario 1: Reference Number Exists
```
PDF Header:
┌─────────────────────────────┐
│ BOOKING REFERENCE           │
│ NHIS-2026-001234           │
└─────────────────────────────┘

Appointments List:
NHIS-2026-001234
```

### Scenario 2: Reference Number Missing
```
PDF Header:
┌─────────────────────────────┐
│ BOOKING REFERENCE           │
│ 507f1f77bcf86cd799439011   │
└─────────────────────────────┘

Appointments List:
ID: 99439011
```

---

## Backend Investigation

If reference numbers are consistently missing, check the backend:

### 1. **Check Appointment Model**
```javascript
// server/src/models/Appointment.js
const appointmentSchema = new Schema({
  referenceNumber: { type: String, required: true },
  // ...
});
```

### 2. **Check Appointment Creation**
```javascript
// server/src/controllers/appointment.controller.js
const appointment = new Appointment({
  referenceNumber: generateReferenceNumber(), // Make sure this is called
  // ...
});
```

### 3. **Check API Response**
```javascript
// Make sure referenceNumber is included in the response
res.json({
  appointment: {
    _id: appointment._id,
    referenceNumber: appointment.referenceNumber, // Include this
    // ...
  }
});
```

---

## Files Modified

1. ✅ `client/src/lib/appointment-pdf.ts` - Added fallback for reference number
2. ✅ `client/src/routes/appointments.tsx` - Always show reference/ID, added debug logging

---

## Benefits

✅ **No More Blank References**
- PDF always shows some identifier
- Users can track their appointments

✅ **Better User Experience**
- Clear identification of each appointment
- Consistent display across UI and PDF

✅ **Easier Debugging**
- Console logs help identify backend issues
- Can see exactly what data is being received

✅ **Graceful Degradation**
- System works even if backend has issues
- Falls back to appointment ID

---

## Next Steps

### If Reference Numbers Are Missing:
1. Check browser console logs when downloading PDF
2. If `referenceNumber` is consistently `null` or `undefined`:
   - Backend is not generating reference numbers
   - Need to fix backend appointment creation
3. If `referenceNumber` exists in console but not in PDF:
   - Contact support (unlikely with current fix)

### If Everything Works:
- Reference numbers should display correctly
- No further action needed
- Can remove debug console.log if desired

---

## Status

✅ **Complete**
- Fallback logic implemented
- Debug logging added
- TypeScript compilation successful
- Ready for testing

---

**Fixed:** May 30, 2026  
**Files Modified:** 2  
**Status:** ✅ Ready for Testing
