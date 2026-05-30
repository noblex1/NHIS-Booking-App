# Ghana Public Holidays System

## Overview

The NHIS booking system now automatically detects and blocks Ghana public holidays based on the official statutory holidays published by the Ministry of the Interior.

## Features

### 1. **Automatic Holiday Detection**
- All official Ghana public holidays are automatically marked as unavailable for booking
- Holidays are highlighted in amber/gold color on the calendar
- Users cannot select holiday dates unless explicitly opened by an admin

### 2. **Holiday Types**

#### Fixed Holidays (same date every year):
- New Year's Day (January 1)
- Constitution Day (January 7)
- Independence Day (March 6)
- May Day / Workers' Day (May 1)
- Day of Prayer and Thanksgiving / Republic Day (July 1)
- Founder's Day / Kwame Nkrumah Memorial Day (September 21)
- Farmer's Day (December 4)
- Christmas Day (December 25)
- Boxing Day (December 26)

#### Movable Holidays (dates change yearly):
- Good Friday
- Easter Monday
- Eid ul-Fitr (Ramadan) - confirmed by Office of the Chief Imam
- Eid al-Adha (Hajj) - confirmed by Office of the Chief Imam

#### Observed Holidays:
- Additional days off when holidays fall on weekends

### 3. **Admin Override Capability**
Admins can still open specific holiday dates if the center decides to operate on a particular holiday by:
1. Going to Admin Dashboard → Availability & Slots
2. Selecting the holiday date
3. Clicking "Open (e.g. Sunday)" button

### 4. **Visual Indicators**

**In Booking Calendar:**
- Holidays are disabled and cannot be selected
- Combined with weekend blocking (Saturdays & Sundays)

**In Admin Availability Calendar:**
- Holidays are highlighted in amber/gold color
- Holiday information banner shows when a holiday date is selected
- Legend explains the color coding:
  - Red: Blocked by admin
  - Amber: Ghana public holiday
  - Gray: Opened (override)

## Implementation Details

### File Structure
```
client/src/lib/ghana-holidays.ts  - Holiday data and utility functions
client/src/routes/book.tsx        - User booking page (holidays disabled)
client/src/routes/admin/_layout/availability.tsx - Admin calendar management
```

### Key Functions

**`isGhanaPublicHoliday(date: Date): boolean`**
- Checks if a given date is a Ghana public holiday
- Used in calendar disabled logic

**`getHolidayInfo(date: Date): Holiday | null`**
- Returns detailed information about a holiday
- Used to display holiday name and description

**`getHolidaysInRange(startDate: Date, endDate: Date): Holiday[]`**
- Gets all holidays within a date range
- Useful for reporting and analytics

**`getHolidayDateSet(startDate: Date, endDate: Date): Set<string>`**
- Returns a Set of holiday date strings for quick lookup
- Optimized for performance

## Data Source

Holiday data is sourced from:
- **Primary:** Ministry of the Interior, Republic of Ghana
  - URL: https://www.mint.gov.gh/statutory-public-holidays/
- **Secondary:** TimeAndDate.com for verification

## Maintenance

### Adding Future Years
When new holiday dates are announced:

1. Open `client/src/lib/ghana-holidays.ts`
2. Add new year's holidays following the existing pattern:

```typescript
const FIXED_HOLIDAYS_2028: Holiday[] = [
  { name: "New Year's Day", date: "2028-01-01", type: 'fixed' },
  // ... add other holidays
];

export const GHANA_HOLIDAYS_2028: Holiday[] = [
  ...FIXED_HOLIDAYS_2028,
  ...EASTER_HOLIDAYS_2028,
  ...ISLAMIC_HOLIDAYS_2028,
];
```

3. Update the `getHolidaysForYear()` function:

```typescript
export function getHolidaysForYear(year: number): Holiday[] {
  switch (year) {
    case 2026:
      return GHANA_HOLIDAYS_2026;
    case 2027:
      return GHANA_HOLIDAYS_2027;
    case 2028:
      return GHANA_HOLIDAYS_2028;
    default:
      return [];
  }
}
```

### Updating Islamic Holidays
Islamic holidays (Eid ul-Fitr, Eid al-Adha) are based on the lunar calendar and dates are confirmed by the Office of the Chief Imam. Update these dates when officially announced.

## User Experience

### For Applicants:
1. Open booking page
2. Select a date from the calendar
3. Holidays, weekends, and blocked dates are automatically disabled
4. Only available working days can be selected

### For Admins:
1. View calendar with color-coded dates
2. See holiday information when selecting dates
3. Can override holidays if center will operate
4. Set slot capacities for available dates

## Benefits

✅ **Compliance:** Automatically follows Ghana's official holiday calendar  
✅ **Accuracy:** Reduces manual errors in blocking holidays  
✅ **Efficiency:** Admins don't need to manually block each holiday  
✅ **Transparency:** Users see why certain dates are unavailable  
✅ **Flexibility:** Admins can still override if needed  
✅ **Maintainability:** Centralized holiday data easy to update  

## Future Enhancements

Potential improvements for future versions:
- API integration to fetch holidays dynamically
- Support for regional holidays (if applicable)
- Holiday notifications/reminders
- Multi-year holiday import
- Export holiday calendar (iCal format)

## Technical Notes

- Holidays are checked client-side for immediate feedback
- Server-side validation should also check holidays (recommended)
- Timezone: All dates use Ghana timezone (GMT/UTC+0)
- Date format: ISO 8601 (YYYY-MM-DD)

## Support

For questions or issues with the holiday system:
1. Check the official MINT website for latest holiday announcements
2. Update the `ghana-holidays.ts` file with new data
3. Test in admin availability page before deploying

---

**Last Updated:** May 30, 2026  
**Data Version:** 2026-2027  
**Source:** Ministry of the Interior, Republic of Ghana
