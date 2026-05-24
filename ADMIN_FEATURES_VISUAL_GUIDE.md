# 🎨 Admin Dashboard - Visual Feature Guide

## 🏠 Dashboard Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  NHIS Admin Dashboard                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Welcome, System Administrator                                   │
│  Overview of your NHIS booking system                           │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Total Users  │  │ Appointments │  │   Upcoming   │         │
│  │     150      │  │     320      │  │      45      │         │
│  │ 142 verified │  │ 280 confirmed│  │ Active books │         │
│  │ +12 this mo. │  │   15 today   │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                   │
│  ┌──────────────┐                                                │
│  │   Officials  │                                                │
│  │      25      │                                                │
│  │  22 active   │                                                │
│  └──────────────┘                                                │
│                                                                   │
│  Recent Users                    Recent Appointments             │
│  ┌────────────────────────┐     ┌────────────────────────┐     │
│  │ John Doe               │     │ Jane Smith             │     │
│  │ john@email.com         │     │ May 25, 2026 - 9:00 AM │     │
│  │ May 24, 2026 ✓ Verified│     │ Status: Confirmed      │     │
│  ├────────────────────────┤     ├────────────────────────┤     │
│  │ Mary Johnson           │     │ Bob Wilson             │     │
│  │ mary@email.com         │     │ May 25, 2026 - 10:30 AM│     │
│  │ May 23, 2026 ⏳ Pending│     │ Status: Confirmed      │     │
│  └────────────────────────┘     └────────────────────────┘     │
│                                                                   │
│  Appointment Status Breakdown                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Confirmed   │  │   Pending    │  │  Cancelled   │         │
│  │     280      │  │      25      │  │      15      │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## 👥 User Management

```
┌─────────────────────────────────────────────────────────────────┐
│  Users Management                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  View and manage all registered users                           │
│                                                                   │
│  ┌──────────────────────────────┐  ┌──────────────┐            │
│  │ 🔍 Search by name, email...  │  │ Filter: All ▼│            │
│  └──────────────────────────────┘  └──────────────┘            │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Name          Email           NHIS #      Status  Actions│   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ John Doe      john@email.com  NHIS-12345  ✓ Verified   │   │
│  │                                            👁 View 🗑️ Del│   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ Mary Johnson  mary@email.com  NHIS-12346  ⏳ Unverified│   │
│  │                                            👁 View 🗑️ Del│   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ Bob Wilson    bob@email.com   NHIS-12347  ✓ Verified   │   │
│  │                                            👁 View 🗑️ Del│   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  Page 1 of 8                          [◀ Previous] [Next ▶]     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

Actions Available:
• 🔍 Search users by name, email, or NHIS number
• 🔽 Filter by verification status (All/Verified/Unverified)
• 👁️ View user details and appointment history
• 🗑️ Delete user (with confirmation dialog)
• 📄 Navigate through pages (20 users per page)
```

## 📅 Appointment Management

```
┌─────────────────────────────────────────────────────────────────┐
│  Appointments Management                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  View and manage all appointments                               │
│                                                                   │
│  ┌──────────────────────────────┐  ┌──────────────┐            │
│  │ 🔍 Search by patient info... │  │ Status: All ▼│            │
│  └──────────────────────────────┘  └──────────────┘            │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Patient      NHIS #     Date         Time    Status     │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ John Doe     NHIS-12345 May 25, 2026 9:00 AM            │   │
│  │ john@email   📅          🕐          [Confirmed ▼] 🗑️   │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ Mary Johnson NHIS-12346 May 25, 2026 10:30 AM           │   │
│  │ mary@email   📅          🕐          [Pending ▼]   🗑️   │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ Bob Wilson   NHIS-12347 May 26, 2026 2:00 PM            │   │
│  │ bob@email    📅          🕐          [Confirmed ▼] 🗑️   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  Page 1 of 16                         [◀ Previous] [Next ▶]     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

Actions Available:
• 🔍 Search appointments by patient name, email, or NHIS number
• 🔽 Filter by status (All/Confirmed/Pending/Cancelled)
• 📅 Filter by date
• 🔄 Update appointment status (dropdown: Confirmed/Pending/Cancelled)
• 🗑️ Delete appointment (with confirmation dialog)
• 📄 Navigate through pages (20 appointments per page)
```

## 👔 NHIS Officials Management

```
┌─────────────────────────────────────────────────────────────────┐
│  NHIS Officials Management                    [➕ Add Official] │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Manage NHIS staff and officials                                │
│                                                                   │
│  ┌──────────────────────────────┐  ┌──────────────┐            │
│  │ 🔍 Search by name, ID...     │  │ Status: All ▼│            │
│  └──────────────────────────────┘  └──────────────┘            │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Name         Email          Emp ID    Dept      Status  │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ Dr. John     john@nhis.gov  NHIS-001  Medical           │   │
│  │ Smith        +233 24 123... Services  ✓ Active  ✏️ 🗑️  │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ Sarah Jones  sarah@nhis.gov NHIS-002  Admin             │   │
│  │              +233 24 456... Services  ✓ Active  ✏️ 🗑️  │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ Mike Brown   mike@nhis.gov  NHIS-003  IT                │   │
│  │              +233 24 789... Support   ⭕ Inactive ✏️ 🗑️ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  Page 1 of 2                          [◀ Previous] [Next ▶]     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

Actions Available:
• ➕ Add new official (opens form dialog)
• 🔍 Search officials by name, email, or employee ID
• 🔽 Filter by status (All/Active/Inactive)
• ✏️ Edit official information (opens form dialog)
• 🗑️ Delete official (with confirmation dialog)
• ✓/⭕ Toggle active/inactive status (click on status)
• 📄 Navigate through pages (20 officials per page)
```

## ➕ Add/Edit Official Form

```
┌─────────────────────────────────────────────────────────────────┐
│  Add New Official                                          [✕]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Add a new NHIS official to the system                         │
│                                                                   │
│  ┌──────────────────────┐  ┌──────────────────────┐            │
│  │ Full Name            │  │ Email                │            │
│  │ Dr. John Smith       │  │ john@nhis.gov.gh     │            │
│  └──────────────────────┘  └──────────────────────┘            │
│                                                                   │
│  ┌──────────────────────┐  ┌──────────────────────┐            │
│  │ Phone                │  │ Employee ID          │            │
│  │ +233 24 123 4567     │  │ NHIS-001             │            │
│  └──────────────────────┘  └──────────────────────┘            │
│                                                                   │
│  ┌──────────────────────┐  ┌──────────────────────┐            │
│  │ Department           │  │ Position             │            │
│  │ Medical Services     │  │ Senior Medical Off.  │            │
│  └──────────────────────┘  └──────────────────────┘            │
│                                                                   │
│                          [Cancel] [Create Official]             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

Form Features:
• ✅ Real-time validation
• ❌ Error messages for invalid inputs
• 📝 All fields required
• 🔄 Loading state during submission
• ✓ Success toast on completion
• ❌ Error toast on failure
```

## 🗑️ Delete Confirmation Dialog

```
┌─────────────────────────────────────────────────────────────────┐
│  Delete User                                               [✕]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ⚠️  Are you sure you want to delete this user?                 │
│                                                                   │
│  This action cannot be undone and will also delete all          │
│  associated appointments.                                        │
│                                                                   │
│                                    [Cancel] [🗑️ Delete]         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

Safety Features:
• ⚠️ Warning message
• 📝 Explanation of consequences
• ❌ Cancel button (default)
• 🗑️ Delete button (destructive color)
• 🔒 Requires explicit confirmation
• 🔄 Loading state during deletion
```

## 🔐 Admin Login

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│                         🛡️                                        │
│                    Admin Portal                                  │
│                                                                   │
│              Sign in to access the admin dashboard              │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Email                                                     │  │
│  │ admin@nhis.gov.gh                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Password                                                  │  │
│  │ ••••••••••                                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│                    [        Sign in        ]                     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

Login Features:
• 🔒 Secure authentication
• ✅ Form validation
• ❌ Error messages
• 🔄 Loading state
• 🔑 JWT token generation
• 🚀 Redirect to dashboard on success
```

## 📱 Sidebar Navigation

```
┌──────────────────┐
│  🛡️ NHIS Admin   │
│  Management      │
├──────────────────┤
│                  │
│ 📊 Dashboard     │ ← Active (highlighted)
│                  │
│ 👥 Users         │
│                  │
│ 📅 Appointments  │
│                  │
│ 👔 NHIS Officials│
│                  │
├──────────────────┤
│ Signed in as     │
│ System Admin     │
│ admin@nhis.gov   │
│                  │
│ [🚪 Logout]      │
└──────────────────┘

Navigation Features:
• 🎨 Active route highlighting
• 🖱️ Hover effects
• 👤 Admin info display
• 🚪 Logout button
• 📱 Responsive (collapses on mobile)
```

## 🎨 Color Coding

### Status Badges
```
✓ Verified    → Green background, green text
⏳ Unverified → Amber background, amber text
✓ Active      → Green background, green text
⭕ Inactive    → Gray background, gray text
```

### Appointment Status
```
🟢 Confirmed  → Green badge with dot
🟡 Pending    → Amber badge with dot
🔴 Cancelled  → Red badge with dot
```

### Action Buttons
```
👁️ View       → Ghost button (transparent)
✏️ Edit       → Ghost button (transparent)
🗑️ Delete     → Ghost button (red text on hover)
➕ Add        → Primary button (gradient)
```

## 📊 Statistics Cards

```
┌──────────────────────────┐
│ 👥                       │
│ Total Users              │
│                          │
│      150                 │
│                          │
│ 142 verified             │
│ 📈 +12 this month        │
└──────────────────────────┘

Card Features:
• 🎨 Icon with colored background
• 📊 Large number display
• 📝 Subtitle with details
• 📈 Trend indicator
• 🎭 Hover animation (lift effect)
• 🎨 Shadow on hover
```

## 🔔 Toast Notifications

```
┌─────────────────────────────────────┐
│ ✅ Success!                         │
│ User deleted successfully           │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ❌ Error!                           │
│ Failed to update appointment        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ℹ️ Info                             │
│ View user details (coming soon)     │
└─────────────────────────────────────┘

Toast Features:
• ✅ Success (green)
• ❌ Error (red)
• ℹ️ Info (blue)
• ⚠️ Warning (amber)
• 🎭 Slide-in animation
• ⏱️ Auto-dismiss (4 seconds)
• 🖱️ Click to dismiss
• 📍 Top-right position
```

## 🔄 Loading States

```
┌─────────────────────────────────────┐
│                                     │
│         🔄 Loading...               │
│                                     │
└─────────────────────────────────────┘

Loading Features:
• 🔄 Spinning icon
• 📝 Loading text
• 🎭 Smooth animation
• 🎨 Centered display
• ⏱️ Shows during data fetch
```

## 📄 Pagination

```
Page 1 of 8                [◀ Previous] [Next ▶]

Pagination Features:
• 📊 Current page indicator
• 📈 Total pages display
• ◀ Previous button (disabled on first page)
• ▶ Next button (disabled on last page)
• 🎨 Button styling
• 🖱️ Hover effects
```

## 🎯 Key Features Summary

### Search & Filter
- 🔍 Real-time search
- 🔽 Multiple filter options
- 📊 Instant results
- 🎯 Precise matching

### Data Management
- 📄 Pagination (20 items per page)
- 📊 Sortable columns
- 🔄 Real-time updates
- 💾 Auto-save

### User Experience
- 🎨 Beautiful UI
- 📱 Responsive design
- ⚡ Fast performance
- 🎭 Smooth animations

### Security
- 🔒 Secure authentication
- 🔑 JWT tokens
- 🛡️ Protected routes
- 👤 Role-based access

---

**This visual guide shows all the features available in your admin dashboard!** 🎉
