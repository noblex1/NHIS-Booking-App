# NHIS Admin Dashboard Guide

## Overview

A comprehensive admin dashboard has been integrated into your NHIS Booking application. The admin portal allows administrators to manage users, appointments, and NHIS officials from a single, professional interface.

## Features

### 🎯 Dashboard Overview
- Real-time statistics for users, appointments, and officials
- Recent activity tracking
- Appointment status breakdown
- User growth analytics

### 👥 User Management
- View all registered users
- Search by name, email, or NHIS number
- Filter by verification status
- View user details and appointment history
- Delete users (with cascading appointment deletion)
- Pagination support

### 📅 Appointment Management
- View all appointments across the system
- Search by patient information
- Filter by status (Confirmed, Pending, Cancelled)
- Update appointment status in real-time
- Delete appointments
- View patient details for each appointment

### 👔 NHIS Officials Management
- Add new NHIS officials
- Edit official information
- Toggle active/inactive status
- Search and filter officials
- Delete officials
- Track by department and position

## Getting Started

### 1. Create an Admin Account

Run the following command to create your first admin account:

```bash
node create-admin.js
```

This will create a super admin with the following credentials:
- **Email**: admin@nhis.gov.gh
- **Password**: Admin@123456

⚠️ **IMPORTANT**: Change the password after first login!

### 2. Access the Admin Portal

Navigate to: `http://localhost:5173/admin/login`

Or in production: `https://yourdomain.com/admin/login`

### 3. Login

Use the credentials created in step 1 to log in.

## Admin Routes

The admin dashboard is fully integrated into your existing client application:

- `/admin/login` - Admin login page
- `/admin/dashboard` - Main dashboard with statistics
- `/admin/users` - User management
- `/admin/appointments` - Appointment management
- `/admin/officials` - NHIS officials management

## Backend API Endpoints

All admin endpoints are prefixed with `/api/admin` and require admin authentication:

### Authentication
- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/auth/profile` - Get admin profile

### Dashboard
- `GET /api/admin/dashboard/stats` - Get dashboard statistics

### Users
- `GET /api/admin/users` - Get all users (with pagination, search, filters)
- `GET /api/admin/users/stats` - Get user statistics
- `GET /api/admin/users/:id` - Get user by ID
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

### Appointments
- `GET /api/admin/appointments` - Get all appointments (with pagination, search, filters)
- `GET /api/admin/appointments/stats` - Get appointment statistics
- `GET /api/admin/appointments/:id` - Get appointment by ID
- `PUT /api/admin/appointments/:id/status` - Update appointment status
- `DELETE /api/admin/appointments/:id` - Delete appointment

### NHIS Officials
- `GET /api/admin/officials` - Get all officials (with pagination, search, filters)
- `GET /api/admin/officials/stats` - Get official statistics
- `GET /api/admin/officials/:id` - Get official by ID
- `POST /api/admin/officials` - Create new official
- `PUT /api/admin/officials/:id` - Update official
- `DELETE /api/admin/officials/:id` - Delete official

## Database Models

### Admin Model
```javascript
{
  fullName: String,
  email: String (unique),
  password: String (hashed),
  role: "super_admin" | "admin",
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### NHIS Official Model
```javascript
{
  fullName: String,
  email: String (unique),
  phone: String,
  employeeId: String (unique),
  department: String,
  position: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- **Separate Authentication**: Admin authentication is completely separate from user authentication
- **Token-based Auth**: JWT tokens with admin-specific claims
- **Role-based Access**: Support for super_admin and admin roles
- **Protected Routes**: All admin routes require authentication
- **Password Hashing**: Bcrypt password hashing
- **Input Validation**: Express-validator for all inputs

## UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Professional Sidebar**: Easy navigation between sections
- **Real-time Updates**: Instant feedback on all actions
- **Search & Filter**: Powerful search and filtering capabilities
- **Pagination**: Efficient handling of large datasets
- **Toast Notifications**: User-friendly success/error messages
- **Confirmation Dialogs**: Prevent accidental deletions
- **Loading States**: Clear loading indicators

## Customization

### Adding More Admin Users

You can modify `create-admin.js` to create additional admin accounts, or create a new script:

```javascript
const admin = await Admin.create({
  fullName: "John Doe",
  email: "john@nhis.gov.gh",
  password: "SecurePassword123",
  role: "admin", // or "super_admin"
  isActive: true,
});
```

### Changing Admin Credentials

To change the default admin credentials, edit the `adminData` object in `create-admin.js` before running it.

### Styling

The admin dashboard uses the same Tailwind CSS and shadcn/ui components as your user portal, ensuring a consistent design language.

## Deployment Notes

1. **Environment Variables**: Ensure `JWT_SECRET` is set in your `.env` file
2. **Create Admin**: Run `node create-admin.js` on your production server
3. **Secure Admin Routes**: Consider adding IP whitelisting for admin routes in production
4. **HTTPS**: Always use HTTPS in production for admin access
5. **Password Policy**: Enforce strong passwords for admin accounts

## Troubleshooting

### Cannot Login
- Verify admin account exists in database
- Check JWT_SECRET is set correctly
- Ensure backend server is running
- Check browser console for errors

### API Errors
- Verify MongoDB connection
- Check admin token is being sent in requests
- Review backend logs for detailed errors

### UI Issues
- Clear browser cache
- Check if all dependencies are installed
- Verify Vite dev server is running

## Future Enhancements

Consider adding:
- Admin activity logs
- Email notifications for critical actions
- Advanced analytics and reporting
- Bulk operations (bulk delete, bulk status update)
- Export data to CSV/Excel
- Admin profile management
- Two-factor authentication
- Password reset functionality

## Support

For issues or questions, refer to the main project documentation or contact the development team.
