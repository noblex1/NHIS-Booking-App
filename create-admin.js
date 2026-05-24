/**
 * Script to create an admin user
 * Usage: node create-admin.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("./src/models/Admin");

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Admin details
    const adminData = {
      fullName: "System Administrator",
      email: "admin@nhis.gov.gh",
      password: "Admin@123456", // Change this in production!
      role: "super_admin",
      isActive: true,
    };

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      console.log("⚠️  Admin already exists with email:", adminData.email);
      console.log("Admin ID:", existingAdmin._id);
      process.exit(0);
    }

    // Create admin
    const admin = await Admin.create(adminData);
    
    console.log("\n✅ Admin created successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧 Email:", admin.email);
    console.log("🔑 Password:", adminData.password);
    console.log("👤 Role:", admin.role);
    console.log("🆔 Admin ID:", admin._id);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n⚠️  IMPORTANT: Change the password after first login!\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
}

createAdmin();
