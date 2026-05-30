# Booking Calendar Rules - Quick Reference

## Automatic Unavailability Rules

The booking system automatically blocks the following dates:

### 1. **Past Dates**
- Any date before today is disabled
- Users can only book future appointments

### 2. **Weekends** 🗓️
- **Saturdays** (automatically blocked)
- **Sundays** (automatically blocked)
- Reason: Non-working days for NHIA service centers

### 3. **Ghana Public Holidays** 🇬🇭
All official statutory public holidays are automatically blocked:

#### 2026 Holidays:
| Date | Holiday | Type |
|------|---------|------|
| Jan 1 | New Year's Day | Fixed |
| Jan 7 | Constitution Day | Fixed |
| Jan 9 | Day off for Constitution Day | Observed |
| Mar 6 | Independence Day | Fixed |
| Mar 20 | Eid ul-Fitr | Movable |
| Mar 21 | Eid ul-Fitr Holiday | Movable |
| Mar 23 | Day off for Eid ul-Fitr | Observed |
| Apr 3 | Good Friday | Movable |
| Apr 6 | Easter Monday | Movable |
| May 1 | May Day (Workers' Day) | Fixed |
| May 27 | Eid al-Adha | Movable |
| Jul 1 | Day of Prayer & Thanksgiving | Fixed |
| Sep 21 | Founder's Day | Fixed |
| Dec 4 | Farmer's Day | Fixed |
| Dec 25 | Christmas Day | Fixed |
| Dec 26 | Boxing Day | Fixed |
| Dec 28 | Day off for Boxing Day | Observed |

### 4. **Admin-Blocked Dates** 🚫
- Dates manually blocked by administrators
- Reasons may include: staff training, maintenance, special events, etc.

### 5. **Fully Booked Dates** 📅
- Dates where all time slots are at maximum capacity
- Shown as unavailable in the time period selection

## Admin Override Capability

Administrators can **override** automatic blocks for special circumstances:

### How to Open a Blocked Date:
1. Navigate to **Admin Dashboard** → **Availability & Slots**
2. Select the date you want to open
3. Click **"Open (e.g. Sunday)"** button
4. Optionally add a note explaining why it's open
5. Set slot capacities for the opened date

### Use Cases for Override:
- Operating on a weekend for catch-up
- Opening on a holiday for special service
- Emergency appointment availability

## Visual Indicators

### User Booking Calendar:
- ✅ **Available dates:** Selectable, normal appearance
- ❌ **Unavailable dates:** Grayed out, cannot be selected
- No distinction shown between weekend/holiday/blocked (all just unavailable)

### Admin Availability Calendar:
- 🔴 **Red highlight:** Admin-blocked dates
- 🟡 **Amber/Gold highlight:** Ghana public holidays
- ⚪ **Gray highlight:** Opened dates (overrides)
- 📋 **Legend:** Displayed below calendar for reference

## Working Days Summary

**Default Working Days:** Monday - Friday  
**Default Non-Working Days:** Saturday, Sunday, Public Holidays  
**Exceptions:** Admin can open any date as needed

## Time Periods

Available time slots per day (when date is available):
- **Morning:** 8:00 AM - 12:00 PM
- **Afternoon:** 12:00 PM - 4:00 PM  
- **Evening:** 4:00 PM - 6:00 PM

Each period has configurable capacity (max slots).

## Important Notes

⚠️ **Islamic Holidays:** Dates for Eid ul-Fitr and Eid al-Adha are tentative and confirmed by the Office of the Chief Imam. These may be adjusted when officially announced.

⚠️ **Observed Holidays:** When a holiday falls on a weekend, an observed holiday (substitute day) is typically declared. These are included in the system.

⚠️ **Future Years:** Holiday data is maintained for current and next year. Update the system annually with new holiday dates.

## For Developers

### Adding New Holiday Rules:
Edit: `client/src/lib/ghana-holidays.ts`

### Modifying Calendar Logic:
Edit: `client/src/routes/book.tsx` (user view)  
Edit: `client/src/routes/admin/_layout/availability.tsx` (admin view)

### Testing:
1. Check that weekends are blocked
2. Verify public holidays are blocked
3. Test admin override functionality
4. Confirm past dates are disabled
5. Validate slot capacity limits

---

**System Version:** 1.0.0  
**Last Updated:** May 30, 2026  
**Maintained By:** Development Team
