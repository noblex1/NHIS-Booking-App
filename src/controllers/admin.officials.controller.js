const NhisOfficial = require("../models/NhisOfficial");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const getAllOfficials = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search = "", status = "all" } = req.query;
  
  const query = {};
  
  // Search by name, email, employee ID, or department
  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { employeeId: { $regex: search, $options: "i" } },
      { department: { $regex: search, $options: "i" } },
    ];
  }
  
  // Filter by active status
  if (status === "active") {
    query.isActive = true;
  } else if (status === "inactive") {
    query.isActive = false;
  }
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const [officials, total] = await Promise.all([
    NhisOfficial.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    NhisOfficial.countDocuments(query),
  ]);
  
  res.status(200).json({
    success: true,
    officials,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

const getOfficialById = asyncHandler(async (req, res) => {
  const official = await NhisOfficial.findById(req.params.id);
  
  if (!official) {
    throw new ApiError(404, "NHIS official not found");
  }
  
  res.status(200).json({
    success: true,
    official,
  });
});

const createOfficial = asyncHandler(async (req, res) => {
  const { fullName, email, phone, employeeId, department, position } = req.body;
  
  // Check if email or employee ID already exists
  const existing = await NhisOfficial.findOne({
    $or: [
      { email: email.trim().toLowerCase() },
      { employeeId: employeeId.trim() },
    ],
  });
  
  if (existing) {
    if (existing.email === email.trim().toLowerCase()) {
      throw new ApiError(409, "Email already in use");
    }
    throw new ApiError(409, "Employee ID already in use");
  }
  
  const official = await NhisOfficial.create({
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    employeeId: employeeId.trim(),
    department: department.trim(),
    position: position.trim(),
  });
  
  res.status(201).json({
    success: true,
    message: "NHIS official created successfully",
    official,
  });
});

const updateOfficial = asyncHandler(async (req, res) => {
  const { fullName, email, phone, employeeId, department, position, isActive } = req.body;
  
  const official = await NhisOfficial.findById(req.params.id);
  
  if (!official) {
    throw new ApiError(404, "NHIS official not found");
  }
  
  // Check if email is being changed and if it's already taken
  if (email && email !== official.email) {
    const existingEmail = await NhisOfficial.findOne({ 
      email: email.trim().toLowerCase(),
      _id: { $ne: official._id }
    });
    
    if (existingEmail) {
      throw new ApiError(409, "Email already in use");
    }
    
    official.email = email.trim().toLowerCase();
  }
  
  // Check if employee ID is being changed and if it's already taken
  if (employeeId && employeeId !== official.employeeId) {
    const existingId = await NhisOfficial.findOne({ 
      employeeId: employeeId.trim(),
      _id: { $ne: official._id }
    });
    
    if (existingId) {
      throw new ApiError(409, "Employee ID already in use");
    }
    
    official.employeeId = employeeId.trim();
  }
  
  if (fullName) official.fullName = fullName.trim();
  if (phone) official.phone = phone.trim();
  if (department) official.department = department.trim();
  if (position) official.position = position.trim();
  if (typeof isActive === "boolean") official.isActive = isActive;
  
  await official.save();
  
  res.status(200).json({
    success: true,
    message: "NHIS official updated successfully",
    official,
  });
});

const deleteOfficial = asyncHandler(async (req, res) => {
  const official = await NhisOfficial.findById(req.params.id);
  
  if (!official) {
    throw new ApiError(404, "NHIS official not found");
  }
  
  await official.deleteOne();
  
  res.status(200).json({
    success: true,
    message: "NHIS official deleted successfully",
  });
});

const getOfficialStats = asyncHandler(async (req, res) => {
  const [
    totalOfficials,
    activeOfficials,
    inactiveOfficials,
  ] = await Promise.all([
    NhisOfficial.countDocuments(),
    NhisOfficial.countDocuments({ isActive: true }),
    NhisOfficial.countDocuments({ isActive: false }),
  ]);
  
  // Get department breakdown
  const departmentStats = await NhisOfficial.aggregate([
    { $group: { _id: "$department", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  
  res.status(200).json({
    success: true,
    stats: {
      total: totalOfficials,
      active: activeOfficials,
      inactive: inactiveOfficials,
      byDepartment: departmentStats,
    },
  });
});

module.exports = {
  getAllOfficials,
  getOfficialById,
  createOfficial,
  updateOfficial,
  deleteOfficial,
  getOfficialStats,
};
