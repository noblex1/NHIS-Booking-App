const User = require("../models/User");
const Appointment = require("../models/Appointment");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search = "", status = "all" } = req.query;
  
  const query = {};
  
  // Search by name, email, or NHIS number
  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { nhisNumber: { $regex: search, $options: "i" } },
    ];
  }
  
  // Filter by verification status
  if (status === "verified") {
    query.isVerified = true;
  } else if (status === "unverified") {
    query.isVerified = false;
  }
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const [users, total] = await Promise.all([
    User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    User.countDocuments(query),
  ]);
  
  res.status(200).json({
    success: true,
    users,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  
  // Get user's appointments
  const appointments = await Appointment.find({ userId: user._id })
    .sort({ date: -1 })
    .limit(10);
  
  res.status(200).json({
    success: true,
    user,
    appointments,
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const { fullName, email, dateOfBirth, isVerified } = req.body;
  
  const user = await User.findById(req.params.id);
  
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  
  // Check if email is being changed and if it's already taken
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ 
      email: email.trim().toLowerCase(),
      _id: { $ne: user._id }
    });
    
    if (existingUser) {
      throw new ApiError(409, "Email already in use");
    }
    
    user.email = email.trim().toLowerCase();
  }
  
  if (fullName) user.fullName = fullName.trim();
  if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth);
  if (typeof isVerified === "boolean") user.isVerified = isVerified;
  
  await user.save();
  
  res.status(200).json({
    success: true,
    message: "User updated successfully",
    user,
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  
  // Delete user's appointments
  await Appointment.deleteMany({ userId: user._id });
  
  // Delete user
  await user.deleteOne();
  
  res.status(200).json({
    success: true,
    message: "User and associated appointments deleted successfully",
  });
});

const getUserStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    verifiedUsers,
    unverifiedUsers,
    recentUsers,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isVerified: true }),
    User.countDocuments({ isVerified: false }),
    User.countDocuments({ 
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
    }),
  ]);
  
  res.status(200).json({
    success: true,
    stats: {
      total: totalUsers,
      verified: verifiedUsers,
      unverified: unverifiedUsers,
      recentlyJoined: recentUsers,
    },
  });
});

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
};
