const Admin = require("../models/Admin");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");

const signAdminToken = (admin) => {
  return jwt.sign(
    { 
      id: admin._id, 
      email: admin.email,
      role: admin.role,
      type: "admin" // Distinguish from regular user tokens
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );
};

const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const cleanEmail = email.trim().toLowerCase();

  const admin = await Admin.findOne({
    email: cleanEmail,
    isActive: true,
  });

  if (!admin) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await admin.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signAdminToken(admin);
  
  res.status(200).json({
    success: true,
    message: "Admin login successful",
    token,
    admin,
  });
});

const getAdminProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    admin: req.admin,
  });
});

module.exports = {
  adminLogin,
  getAdminProfile,
};
