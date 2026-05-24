# 🏥 NHIS Admin Dashboard

> A comprehensive, professional admin dashboard for managing the NHIS Booking System

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Screenshots](#screenshots)
- [Architecture](#architecture)
- [API Documentation](#api-documentation)
- [Security](#security)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

The NHIS Admin Dashboard is a complete administrative interface that provides full control over:
- **Users**: Manage all registered users and their verification status
- **Appointments**: View, update, and manage all appointments
- **NHIS Officials**: Add and manage NHIS staff members
- **Analytics**: Real-time statistics and insights

### Key Highlights

✅ **Fully Integrated** - Seamlessly integrated into your existing application  
✅ **Production Ready** - Complete with security, validation, and error handling  
✅ **Responsive Design** - Works on desktop, tablet, and mobile  
✅ **Type Safe** - Full TypeScript support  
✅ **Real-time Updates** - Instant feedback on all actions  
✅ **Professional UI** - Beautiful, modern interface  

## ✨ Features

### 1. Dashboard Overview
- **Real-time Statistics**
  - Total users (verified/unverified)
  - Total appointments (by status)
  - NHIS officials count
  - Today's appointments
  - New users this month
  
- **Recent Activity**
  - Latest user registrations
  - Recent appointment bookings
  - Quick status overview

- **Analytics**
  - User growth trends
  - Appointment status breakdown
  - Department-wise official distribution

### 2. User Management
- **View All Users**
  - Paginated list (20 per page)
  - Full user details (name, email, NHIS number)
  - Verification status indicators
  - Join date tracking

- **Search & Filter**
  - Search by name, email, or NHIS number
  - Filter by verification status
  - Real-time search results

- **User Actions**
  - View user details
  - View user's appointment history
  - Delete users (with confirmation)
  - Update user information

### 3. Appointment Management
- **View All Appointments**
  - Paginated list with patient details
  - Date and time information
  - Current status display
  - Booking date tracking

- **Search & Filter**
  - Search by patient information
  - Filter by status (Confirmed/Pending/Cancelled)
  - Filter by date
  - Real-time filtering

- **Appointment Actions**
  - Update status (dropdown selection)
  - View patient details
  - Delete appointments
  - Real-time status updates

### 4. NHIS Officials Management
- **View All Officials**
  - Paginated list of staff
  - Employee ID tracking
  - Department and position info
  - Active/inactive status

- **Search & Filter**
  - Search by name, email, or employee ID
  - Filter by active status
  - Department filtering

- **Official Actions**
  - Add new officials (full form)
  - Edit official information
  - Toggle active/inactive status
  - Delete officials
  - Full CRUD operations

### 5. Authentication & Security
- **Secure Login**
  - Separate admin authentication
  - JWT-based sessions
  - Role-based access control
  - Automatic token refresh

- **Protected Routes**
  - Frontend route guards
  - Backend middleware protection
  - Token validation
  - Session management

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository** (if not already done)
   ```bash
   git clone <your-repo-url>
   cd nhis-booking-app
   ```

2. **Install dependencies**
   ```bash
   # Backend
   npm install

   # Frontend
   cd client
   npm install
   cd ..
   ```

3. **Set up environment variables**
   
   Ensure your `.env` file has:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   ```

4. **Create admin account**
   ```bash
   npm run create-admin
   ```

   This creates:
   - Email: `admin@nhis.gov.gh`
   - Password: `Admin@123456`
   - Role: `super_admin`

5. **Start the application**
   
   Terminal 1 (Backend):
   ```bash
   npm run dev
   ```

   Terminal 2 (Frontend):
   ```bash
   cd client
   npm run dev
   ```

6. **Access the admin portal**
   ```
   http://localhost:5173/admin/login
   ```

## 📸 Screenshots

### Login Page
Clean, professional login interface with security focus.

### Dashboard
Real-time statistics, recent activity, and analytics at a glance.

### User Management
Comprehensive user list with search, filter, and management capabilities.

### Appointment Management
Full appointment control with status updates and patient information.

### Officials Management
Complete CRUD interface for managing NHIS staff.

## 🏗️ Architecture

### Frontend Structure
```
client/src/
├── lib/
│   ├── admin-api-client.ts    # API client for admin endpoints
│   └── admin-store.ts          # Admin state management
├── components/
│   └── AdminSidebar.tsx        # Navigation sidebar
└── routes/admin/
    ├── login.tsx               # Admin login
    └── _layout/
        ├── dashboard.tsx       # Dashboard overview
        ├── users.tsx           # User management
        ├── appointments.tsx    # Appointment management
        └── officials.tsx       # Officials management
```

### Backend Structure
```
src/
├── models/
│   ├── Admin.js                # Admin user model
│   └── NhisOfficial.js        # NHIS official model
├── controllers/
│   ├── admin.auth.controller.js
│   ├── admin.dashboard.controller.js
│   ├── admin.users.controller.js
│   ├── admin.appointments.controller.js
│   └── admin.officials.controller.js
├── middlewares/
│   └── admin.middleware.js     # Admin authentication
└── routes/
    └── admin.routes.js         # All admin routes
```

### Technology Stack

**Frontend:**
- React 19
- TypeScript
- TanStack Router
- Tailwind CSS
- shadcn/ui
- React Hook Form + Zod
- date-fns
- Sonner (toasts)

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT
- bcryptjs
- express-validator

## 📚 API Documentation

### Base URL
```
/api/admin
```

### Authentication
All endpoints (except login) require JWT token in header:
```
Authorization: Bearer <token>
```

### Endpoints

#### Authentication
```http
POST /api/admin/auth/login
Content-Type: application/json

{
  "email": "admin@nhis.gov.gh",
  "password": "Admin@123456"
}

Response: {
  "success": true,
  "token": "jwt_token_here",
  "admin": { ... }
}
```

#### Dashboard Stats
```http
GET /api/admin/dashboard/stats
Authorization: Bearer <token>

Response: {
  "success": true,
  "stats": {
    "users": { ... },
    "appointments": { ... },
    "officials": { ... },
    "recent": { ... }
  }
}
```

#### Users
```http
# List users
GET /api/admin/users?page=1&limit=20&search=john&status=verified

# Get user by ID
GET /api/admin/users/:id

# Update user
PUT /api/admin/users/:id
Content-Type: application/json
{
  "fullName": "John Doe",
  "isVerified": true
}

# Delete user
DELETE /api/admin/users/:id
```

#### Appointments
```http
# List appointments
GET /api/admin/appointments?page=1&limit=20&status=Confirmed

# Update appointment status
PUT /api/admin/appointments/:id/status
Content-Type: application/json
{
  "status": "Confirmed"
}

# Delete appointment
DELETE /api/admin/appointments/:id
```

#### NHIS Officials
```http
# List officials
GET /api/admin/officials?page=1&limit=20&status=active

# Create official
POST /api/admin/officials
Content-Type: application/json
{
  "fullName": "Dr. John Smith",
  "email": "john@nhis.gov.gh",
  "phone": "+233 24 123 4567",
  "employeeId": "NHIS-001",
  "department": "Medical Services",
  "position": "Senior Medical Officer"
}

# Update official
PUT /api/admin/officials/:id

# Delete official
DELETE /api/admin/officials/:id
```

## 🔒 Security

### Authentication Flow
1. Admin logs in with email/password
2. Backend validates credentials
3. JWT token generated with admin claims
4. Token stored in localStorage
5. Token sent with every API request
6. Backend validates token on each request

### Security Features
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT tokens with expiration
- ✅ Separate admin authentication system
- ✅ Role-based access control
- ✅ Protected routes (frontend & backend)
- ✅ Input validation on all endpoints
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Rate limiting (can be added)

### Best Practices
1. **Change default password** after first login
2. **Use strong passwords** (min 12 characters)
3. **Enable HTTPS** in production
4. **Rotate JWT secrets** periodically
5. **Monitor admin activity** (add logging)
6. **Limit admin accounts** (only create when needed)
7. **Use environment variables** for secrets

## 🚢 Deployment

### Frontend (Vercel/Netlify)
1. Build the client:
   ```bash
   cd client
   npm run build
   ```

2. Deploy `client/dist` folder

3. Set environment variable:
   ```
   VITE_API_BASE_URL=https://your-backend-url.com
   ```

### Backend (Railway/Render/Heroku)
1. Push code to repository

2. Set environment variables:
   ```
   MONGODB_URI=your_mongodb_atlas_url
   JWT_SECRET=your_secret_key
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   ```

3. Create admin account:
   ```bash
   npm run create-admin
   ```

### Database (MongoDB Atlas)
1. Create cluster
2. Whitelist IP addresses
3. Create database user
4. Get connection string
5. Add to environment variables

## 🔧 Troubleshooting

### Cannot Login
**Problem:** Login fails with "Invalid credentials"

**Solutions:**
- Verify admin account exists: Check MongoDB
- Ensure password is correct
- Check JWT_SECRET is set in .env
- Verify backend is running

### API Errors
**Problem:** "401 Unauthorized" or "403 Forbidden"

**Solutions:**
- Check token is being sent in requests
- Verify token hasn't expired
- Ensure admin account is active
- Check backend logs for details

### Build Errors
**Problem:** Frontend build fails

**Solutions:**
- Delete `node_modules` and reinstall
- Clear npm cache: `npm cache clean --force`
- Check TypeScript errors: `npm run build`
- Verify all dependencies are installed

### Database Connection
**Problem:** Cannot connect to MongoDB

**Solutions:**
- Check MONGODB_URI in .env
- Verify MongoDB is running (local)
- Check network access (Atlas)
- Verify credentials are correct

## 📝 Additional Resources

- **Quick Start Guide**: `ADMIN_QUICK_START.md`
- **Detailed Guide**: `ADMIN_DASHBOARD_GUIDE.md`
- **Architecture**: `ADMIN_ARCHITECTURE.md`
- **Summary**: `ADMIN_DASHBOARD_SUMMARY.md`

## 🤝 Contributing

When adding new features to the admin dashboard:

1. Follow existing code structure
2. Add proper TypeScript types
3. Include error handling
4. Add input validation
5. Update documentation
6. Test thoroughly

## 📄 License

This project is part of the NHIS Booking Application.

## 🎉 Congratulations!

You now have a fully functional, professional admin dashboard. Enjoy managing your NHIS booking system!

---

**Need help?** Check the troubleshooting section or review the detailed guides in the documentation folder.
