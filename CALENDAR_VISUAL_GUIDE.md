# Calendar System - Visual Guide

## 📅 How the Booking Calendar Works

### User View (Booking Page)

```
┌─────────────────────────────────────────────────┐
│         Book Centre Visit - March 2026          │
├─────────────────────────────────────────────────┤
│                                                  │
│   Su  Mo  Tu  We  Th  Fr  Sa                    │
│   ❌  ✅  ✅  ✅  ✅  ✅  ❌   Week 1            │
│   ❌  ✅  ✅  ❌  ✅  ✅  ❌   Week 2            │
│   ❌  ✅  ✅  ✅  ✅  ✅  ❌   Week 3            │
│   ❌  ✅  ✅  ✅  ✅  ✅  ❌   Week 4            │
│                                                  │
│   Legend:                                        │
│   ✅ = Available for booking                    │
│   ❌ = Unavailable (weekend/holiday/blocked)    │
│                                                  │
└─────────────────────────────────────────────────┘

Special Dates in March 2026:
- March 6 (Fri): ❌ Independence Day (Public Holiday)
- March 20 (Fri): ❌ Eid ul-Fitr (Public Holiday)
- March 21 (Sat): ❌ Eid ul-Fitr Holiday + Weekend
- March 23 (Mon): ❌ Day off for Eid ul-Fitr
```

### Admin View (Availability Management)

```
┌─────────────────────────────────────────────────┐
│      Availability & Slots - March 2026          │
├─────────────────────────────────────────────────┤
│                                                  │
│   Su  Mo  Tu  We  Th  Fr  Sa                    │
│   ⚪  ⬜  ⬜  ⬜  ⬜  🟡  ⚪   Week 1            │
│   ⚪  ⬜  ⬜  🟡  ⬜  ⬜  ⚪   Week 2            │
│   ⚪  🟡  ⬜  ⬜  ⬜  ⬜  ⚪   Week 3            │
│   ⚪  ⬜  ⬜  ⬜  ⬜  ⬜  ⚪   Week 4            │
│                                                  │
│   Legend:                                        │
│   ⬜ = Normal working day                       │
│   ⚪ = Weekend (auto-blocked)                   │
│   🟡 = Public holiday (auto-blocked)           │
│   🔴 = Admin blocked                            │
│   🟢 = Opened (override)                        │
│                                                  │
└─────────────────────────────────────────────────┘

When Admin Clicks March 6 (Independence Day):
┌─────────────────────────────────────────────────┐
│  🇬🇭 Independence Day                           │
│  Celebrates Ghana's independence from British    │
│  colonial rule                                   │
│                                                  │
│  Ghana Public Holiday - automatically            │
│  unavailable unless opened                       │
│                                                  │
│  [🚫 Block entire day]  [✅ Open (e.g. Sunday)] │
│                                                  │
│  Note: ________________________________          │
│                                                  │
└─────────────────────────────────────────────────┘
```

## 🔄 Decision Flow

### When User Selects a Date:

```
User clicks on a date
        ↓
Is date in the past? ──YES──→ ❌ DISABLED
        ↓ NO
Is it Saturday or Sunday? ──YES──→ Is it explicitly opened? ──NO──→ ❌ DISABLED
        ↓ NO                              ↓ YES
Is it a Ghana holiday? ──YES──→ Is it explicitly opened? ──NO──→ ❌ DISABLED
        ↓ NO                              ↓ YES
Is it admin-blocked? ──YES──→ ❌ DISABLED
        ↓ NO
Are all slots full? ──YES──→ ❌ DISABLED
        ↓ NO
        ✅ AVAILABLE - Show time slots
```

## 📊 Date Status Examples

### Example 1: Normal Working Day
```
Date: Tuesday, March 3, 2026
Status: ✅ AVAILABLE
Reason: Weekday, not a holiday, not blocked
Time Slots:
  - Morning (8AM-12PM): 5 slots available
  - Afternoon (12PM-4PM): 3 slots available
  - Evening (4PM-6PM): 2 slots available
```

### Example 2: Weekend
```
Date: Saturday, March 7, 2026
Status: ❌ UNAVAILABLE
Reason: Weekend (Saturday)
Override: Admin can open if needed
```

### Example 3: Public Holiday
```
Date: Friday, March 6, 2026
Status: ❌ UNAVAILABLE
Reason: Independence Day (Ghana Public Holiday)
Override: Admin can open if needed
Holiday Info:
  Name: Independence Day
  Description: Celebrates Ghana's independence
  Type: Fixed (same date every year)
```

### Example 4: Admin Blocked
```
Date: Monday, March 9, 2026
Status: ❌ UNAVAILABLE
Reason: Blocked by admin
Note: "Staff training day"
Override: Admin can unblock
```

### Example 5: Opened Weekend
```
Date: Sunday, March 15, 2026
Status: ✅ AVAILABLE (Override)
Reason: Admin explicitly opened this Sunday
Note: "Catch-up day for backlog"
Time Slots: Set by admin
```

## 🎨 Color Coding Reference

### User Booking Calendar:
| Visual | Meaning | Can Select? |
|--------|---------|-------------|
| Normal | Available date | ✅ Yes |
| Grayed | Unavailable | ❌ No |
| Faded | Past date | ❌ No |

### Admin Availability Calendar:
| Color | Meaning | Action Available |
|-------|---------|------------------|
| 🔴 Red | Admin blocked | Can unblock |
| 🟡 Amber | Public holiday | Can override |
| ⚪ Gray | Weekend | Can override |
| 🟢 Green | Opened (override) | Can close |
| ⬜ White | Normal working day | Can block |

## 📱 Mobile vs Desktop View

### Desktop (Wide Screen):
```
┌────────────────────────────────────────────────────────┐
│  Calendar          │  Selected Date Info               │
│  [March 2026]      │  Friday, March 6, 2026            │
│                    │  🇬🇭 Independence Day              │
│  Su Mo Tu We Th Fr │                                   │
│  1  2  3  4  5  6  │  Time Periods:                    │
│  8  9  10 11 12 13 │  ○ Morning (8AM-12PM)             │
│  15 16 17 18 19 20 │  ○ Afternoon (12PM-4PM)           │
│  22 23 24 25 26 27 │  ○ Evening (4PM-6PM)              │
│  29 30 31          │                                   │
└────────────────────────────────────────────────────────┘
```

### Mobile (Narrow Screen):
```
┌──────────────────────┐
│  [March 2026]        │
│                      │
│  Su Mo Tu We Th Fr   │
│  1  2  3  4  5  6    │
│  8  9  10 11 12 13   │
│  15 16 17 18 19 20   │
│  22 23 24 25 26 27   │
│  29 30 31            │
└──────────────────────┘
        ↓
┌──────────────────────┐
│  Friday, March 6     │
│  🇬🇭 Independence Day │
│                      │
│  Time Periods:       │
│  ○ Morning           │
│  ○ Afternoon         │
│  ○ Evening           │
└──────────────────────┘
```

## 🔔 User Notifications

### When Date is Unavailable:
```
User tries to click unavailable date
        ↓
No action (date is disabled)
Cursor shows "not-allowed" icon
```

### When All Slots Full:
```
User selects date with full slots
        ↓
Time period section shows:
"❌ Morning: Fully booked"
"❌ Afternoon: Fully booked"
"❌ Evening: Fully booked"
```

### When Booking Successful:
```
✅ Application submitted!
Reference: NHIS-2026-001234

[View My Bookings]
```

## 📋 Admin Actions

### Opening a Holiday:
```
1. Admin selects Independence Day (March 6)
2. Sees holiday banner: "🇬🇭 Independence Day"
3. Clicks "Open (e.g. Sunday)" button
4. Adds note: "Special service day"
5. Sets slot capacities:
   - Morning: 10 slots
   - Afternoon: 8 slots
   - Evening: 5 slots
6. Clicks "Save slot limits"
7. Date now available for booking ✅
```

### Blocking a Normal Day:
```
1. Admin selects March 10 (Tuesday)
2. Clicks "Block entire day" button
3. Adds note: "Maintenance work"
4. Date now unavailable for booking ❌
```

## 🗓️ Year Overview

### 2026 Ghana Public Holidays:
```
January:    1 (New Year), 7 (Constitution), 9 (Observed)
February:   -
March:      6 (Independence), 20-21, 23 (Eid ul-Fitr)
April:      3 (Good Friday), 6 (Easter Monday)
May:        1 (May Day), 27 (Eid al-Adha)
June:       -
July:       1 (Republic Day)
August:     -
September:  21 (Founder's Day)
October:    -
November:   -
December:   4 (Farmer's), 25 (Christmas), 26, 28 (Boxing)

Total: 17 public holiday dates
Plus: 104 weekend days (52 Saturdays + 52 Sundays)
= 121 non-working days by default
= 244 potential working days (365 - 121)
```

## 💡 Tips for Users

1. **Plan Ahead:** Book early as slots fill up quickly
2. **Check Holidays:** System automatically blocks holidays
3. **Weekdays Best:** Monday-Friday are regular working days
4. **Time Flexibility:** Try different time periods if one is full
5. **Reference Number:** Save your booking reference for tracking

## 💡 Tips for Admins

1. **Review Monthly:** Check upcoming month's availability
2. **Set Capacities:** Adjust slots based on staff availability
3. **Override Wisely:** Only open holidays when truly operating
4. **Add Notes:** Document why dates are blocked/opened
5. **Monitor Bookings:** Track slot usage to optimize capacity

---

**Visual Guide Version:** 1.0  
**Last Updated:** May 30, 2026  
**System:** NHIS Booking Platform
