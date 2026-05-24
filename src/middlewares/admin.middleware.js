const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const adminAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Admin authentication required");
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if this is an admin token
    if (decoded.type !== "admin") {
      throw new ApiError(403, "Admin access required");
    }

    const admin = await Admin.findById(decoded.id).select("-password");
    
    if (!admin) {
      throw new ApiError(401, "Admin not found");
    }

    if (!admin.isActive) {
      throw new ApiError(403, "Admin account is inactive");
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(401, "Invalid or expired admin token");
  }
});

const superAdminAuth = asyncHandler(async (req, res, next) => {
  if (req.admin.role !== "super_admin") {
    throw new ApiError(403, "Super admin access required");
  }
  next();
});

module.exports = {
  adminAuth,
  superAdminAuth,
};
