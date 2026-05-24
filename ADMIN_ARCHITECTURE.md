# Admin Dashboard Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     NHIS Booking Application                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────┐         ┌─────────────────────┐       │
│  │   User Portal       │         │   Admin Portal      │       │
│  │   (Existing)        │         │   (New)             │       │
│  ├─────────────────────┤         ├─────────────────────┤       │
│  │ • Home              │         │ • Login             │       │
│  │ • Login/Register    │         │ • Dashboard         │       │
│  │ • Book Appointment  │         │ • Users Mgmt        │       │
│  │ • My Appointments   │         │ • Appointments Mgmt │       │
│  │ • Profile           │         │ • Officials Mgmt    │       │
│  └─────────────────────┘         └─────────────────────┘       │
│           │                               │                      │
│           └───────────────┬───────────────┘                      │
│                           │                                      │
│                    ┌──────▼──────┐                              │
│                    │   Backend   │                              │
│                    │   API       │                              │
│                    └─────────────┘                              │
└─────────────────────────────────────────────────────────────────┘
```

## Admin Dashboard Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                      Admin Login                                  │
│                   /admin/login                                    │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Email: admin@nhis.gov.gh                               │   │
│  │  Password: ••••••••••                                   │   │
│  │                                                          │   │
│  │              [Sign In Button]                           │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
                              │
                              │ JWT Token
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                    Admin Dashboard Layout                         │
│  ┌────────────┬─────────────────────────────────────────────┐   │
│  │            │                                              │   │
│  │  Sidebar   │           Main Content Area                 │   │
│  │            │                                              │   │
│  │ • Logo     │  ┌────────────────────────────────────┐    │   │
│  │            │  │                                     │    │   │
│  │ Navigation │  │      Dashboard / Users /           │    │   │
│  │ • Dashboard│  │      Appointments / Officials      │    │   │
│  │ • Users    │  │                                     │    │   │
│  │ • Appts    │  │                                     │    │   │
│  │ • Officials│  │                                     │    │   │
│  │            │  └────────────────────────────────────┘    │   │
│  │ Admin Info │                                              │   │
│  │ • Name     │                                              │   │
│  │ • Email    │                                              │   │
│  │ [Logout]   │                                              │   │
│  │            │                                              │   │
│  └────────────┴─────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐      ┌──────────────────┐                │
│  │  Admin Routes    │      │  Admin Store     │                │
│  │  (TanStack)      │◄────►│  (State Mgmt)    │                │
│  └────────┬─────────┘      └──────────────────┘                │
│           │                                                      │
│           │                                                      │
│  ┌────────▼─────────┐                                           │
│  │  Admin API       │                                           │
│  │  Client          │                                           │
│  └────────┬─────────┘                                           │
│           │                                                      │
└───────────┼─────────────────────────────────────────────────────┘
            │
            │ HTTP Requests (JWT Token in Header)
            │
┌───────────▼─────────────────────────────────────────────────────┐
│                      Backend (Express)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐      ┌──────────────────┐                │
│  │  Admin Routes    │─────►│  Admin Auth      │                │
│  │  /api/admin/*    │      │  Middleware      │                │
│  └────────┬─────────┘      └──────────────────┘                │
│           │                                                      │
│           │                                                      │
│  ┌────────▼─────────┐                                           │
│  │  Controllers     │                                           │
│  │  • Dashboard     │                                           │
│  │  • Users         │                                           │
│  │  • Appointments  │                                           │
│  │  • Officials     │                                           │
│  └────────┬─────────┘                                           │
│           │                                                      │
└───────────┼─────────────────────────────────────────────────────┘
            │
            │ MongoDB Queries
            │
┌───────────▼─────────────────────────────────────────────────────┐
│                      Database (MongoDB)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Admins     │  │    Users     │  │ Appointments │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐                            │
│  │   Officials  │  │     OTPs     │                            │
│  └──────────────┘  └──────────────┘                            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## API Endpoint Structure

```
/api/admin
│
├── /auth
│   ├── POST   /login          → Admin login
│   └── GET    /profile        → Get admin profile
│
├── /dashboard
│   └── GET    /stats          → Dashboard statistics
│
├── /users
│   ├── GET    /               → List all users (paginated)
│   ├── GET    /stats          → User statistics
│   ├── GET    /:id            → Get user by ID
│   ├── PUT    /:id            → Update user
│   └── DELETE /:id            → Delete user
│
├── /appointments
│   ├── GET    /               → List all appointments (paginated)
│   ├── GET    /stats          → Appointment statistics
│   ├── GET    /:id            → Get appointment by ID
│   ├── PUT    /:id/status     → Update appointment status
│   └── DELETE /:id            → Delete appointment
│
└── /officials
    ├── GET    /               → List all officials (paginated)
    ├── GET    /stats          → Official statistics
    ├── GET    /:id            → Get official by ID
    ├── POST   /               → Create new official
    ├── PUT    /:id            → Update official
    └── DELETE /:id            → Delete official
```

## Component Hierarchy

```
AdminLayout
│
├── AdminSidebar
│   ├── Logo
│   ├── Navigation Links
│   │   ├── Dashboard
│   │   ├── Users
│   │   ├── Appointments
│   │   └── Officials
│   ├── Admin Info
│   └── Logout Button
│
└── Main Content (Outlet)
    │
    ├── Dashboard Page
    │   ├── Stats Cards
    │   ├── Recent Users
    │   ├── Recent Appointments
    │   └── Status Breakdown
    │
    ├── Users Page
    │   ├── Search & Filters
    │   ├── Users Table
    │   ├── Pagination
    │   └── Delete Dialog
    │
    ├── Appointments Page
    │   ├── Search & Filters
    │   ├── Appointments Table
    │   ├── Status Dropdown
    │   ├── Pagination
    │   └── Delete Dialog
    │
    └── Officials Page
        ├── Search & Filters
        ├── Add Official Button
        ├── Officials Table
        ├── Create/Edit Dialog
        ├── Pagination
        └── Delete Dialog
```

## Security Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      Security Layers                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. Frontend Route Protection                                    │
│     ↓                                                            │
│     • Check if admin token exists                               │
│     • Redirect to /admin/login if not authenticated             │
│                                                                   │
│  2. API Request (with JWT Token)                                │
│     ↓                                                            │
│     • Token sent in Authorization header                        │
│     • Bearer token format                                       │
│                                                                   │
│  3. Backend Middleware (adminAuth)                              │
│     ↓                                                            │
│     • Verify JWT token                                          │
│     • Check token type === "admin"                              │
│     • Verify admin exists in database                           │
│     • Check admin.isActive === true                             │
│                                                                   │
│  4. Controller Action                                            │
│     ↓                                                            │
│     • Input validation                                          │
│     • Business logic                                            │
│     • Database operations                                       │
│                                                                   │
│  5. Response                                                     │
│     ↓                                                            │
│     • Success or error response                                 │
│     • Sanitized data (no passwords)                             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Database Schema

```
┌─────────────────────────────────────────────────────────────────┐
│                         Admin Collection                         │
├─────────────────────────────────────────────────────────────────┤
│  _id          : ObjectId                                         │
│  fullName     : String                                           │
│  email        : String (unique, indexed)                         │
│  password     : String (hashed with bcrypt)                      │
│  role         : String (enum: "super_admin", "admin")            │
│  isActive     : Boolean                                          │
│  createdAt    : Date                                             │
│  updatedAt    : Date                                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    NhisOfficial Collection                       │
├─────────────────────────────────────────────────────────────────┤
│  _id          : ObjectId                                         │
│  fullName     : String                                           │
│  email        : String (unique, indexed)                         │
│  phone        : String                                           │
│  employeeId   : String (unique, indexed)                         │
│  department   : String                                           │
│  position     : String                                           │
│  isActive     : Boolean                                          │
│  createdAt    : Date                                             │
│  updatedAt    : Date                                             │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend Stack                           │
├─────────────────────────────────────────────────────────────────┤
│  • React 19                                                      │
│  • TypeScript                                                    │
│  • TanStack Router (file-based routing)                         │
│  • Tailwind CSS                                                  │
│  • shadcn/ui (component library)                                │
│  • React Hook Form + Zod (form validation)                      │
│  • date-fns (date formatting)                                   │
│  • Sonner (toast notifications)                                 │
│  • Lucide React (icons)                                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         Backend Stack                            │
├─────────────────────────────────────────────────────────────────┤
│  • Node.js                                                       │
│  • Express.js                                                    │
│  • MongoDB + Mongoose                                            │
│  • JWT (jsonwebtoken)                                           │
│  • bcryptjs (password hashing)                                  │
│  • express-validator (input validation)                         │
│  • Helmet (security headers)                                    │
│  • CORS                                                          │
│  • Morgan (logging)                                             │
└─────────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Production Setup                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Frontend (Vercel/Netlify)                                      │
│  ├── Static files served via CDN                                │
│  ├── /admin/* routes handled by client-side router              │
│  └── Environment: VITE_API_BASE_URL                             │
│                                                                   │
│  Backend (Railway/Render/Heroku)                                │
│  ├── Node.js server                                             │
│  ├── /api/admin/* endpoints                                     │
│  └── Environment: JWT_SECRET, MONGODB_URI                       │
│                                                                   │
│  Database (MongoDB Atlas)                                        │
│  ├── Admins collection                                          │
│  ├── Users collection                                           │
│  ├── Appointments collection                                    │
│  ├── NhisOfficials collection                                   │
│  └── OTPs collection                                            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

This architecture provides a scalable, secure, and maintainable admin dashboard system!
