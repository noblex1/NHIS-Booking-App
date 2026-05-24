# 🚀 Admin Dashboard - Quick Start (5 Minutes)

## Step 1: Create Admin Account (1 minute)

Open your terminal in the project root and run:

```bash
npm run create-admin
```

You'll see:
```
✅ Admin created successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Email: admin@nhis.gov.gh
🔑 Password: Admin@123456
👤 Role: super_admin
🆔 Admin ID: [your-admin-id]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Step 2: Start Your Servers (1 minute)

### Terminal 1 - Backend:
```bash
npm run dev
```

### Terminal 2 - Frontend:
```bash
cd client
npm run dev
```

## Step 3: Access Admin Portal (30 seconds)

Open your browser and go to:
```
http://localhost:5173/admin/login
```

## Step 4: Login (30 seconds)

Use the credentials from Step 1:
- **Email**: `admin@nhis.gov.gh`
- **Password**: `Admin@123456`

## Step 5: Explore! (2 minutes)

You're now in the admin dashboard! 🎉

### What You Can Do:

1. **Dashboard** - View statistics and recent activity
2. **Users** - Manage all registered users
3. **Appointments** - View and update all appointments
4. **NHIS Officials** - Add and manage NHIS staff

## 🎯 Quick Actions

### Add an NHIS Official
1. Click "NHIS Officials" in sidebar
2. Click "Add Official" button
3. Fill in the form:
   - Full Name: `Dr. John Smith`
   - Email: `john.smith@nhis.gov.gh`
   - Phone: `+233 24 123 4567`
   - Employee ID: `NHIS-001`
   - Department: `Medical Services`
   - Position: `Senior Medical Officer`
4. Click "Create Official"

### Update Appointment Status
1. Click "Appointments" in sidebar
2. Find an appointment
3. Click the status dropdown
4. Select new status (Confirmed/Pending/Cancelled)
5. Done! ✅

### Search for a User
1. Click "Users" in sidebar
2. Type in the search box (name, email, or NHIS number)
3. Click "Search"
4. Results appear instantly

## 🔐 Security Reminder

**IMPORTANT**: Change your admin password after first login!

(Password change feature can be added in the admin profile section)

## 📱 Mobile Access

The admin dashboard is fully responsive! Access it from:
- 💻 Desktop
- 📱 Tablet
- 📱 Mobile phone

## 🆘 Troubleshooting

### Can't login?
- Make sure you ran `npm run create-admin`
- Check that backend server is running
- Verify MongoDB is connected

### Page not found?
- Make sure frontend dev server is running
- Clear browser cache
- Try `http://localhost:5173/admin/login` (with /admin)

### API errors?
- Check backend console for errors
- Verify `.env` file has `JWT_SECRET`
- Ensure MongoDB connection string is correct

## 🎊 You're All Set!

Your admin dashboard is now fully operational. Enjoy managing your NHIS booking system! 🚀

---

**Need more details?** Check out `ADMIN_DASHBOARD_GUIDE.md` for comprehensive documentation.
