const NhisOfficial = require("../models/NhisOfficial");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { getDefaultCentre } = require("../services/centre.service");

const officialPopulate = {
  path: "assignedCentreId",
  select: "name code city region",
};

const getAllOfficials = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search = "", status = "all" } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  if (status === "active") {
    query.isActive = true;
  } else if (status === "inactive") {
    query.isActive = false;
  }

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const [officials, total] = await Promise.all([
    NhisOfficial.find(query)
      .populate(officialPopulate)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10)),
    NhisOfficial.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    officials,
    pagination: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
      pages: Math.ceil(total / parseInt(limit, 10)),
    },
  });
});

const getOfficialById = asyncHandler(async (req, res) => {
  const official = await NhisOfficial.findById(req.params.id).populate(officialPopulate);

  if (!official) {
    throw new ApiError(404, "NHIS official not found");
  }

  res.status(200).json({
    success: true,
    official,
  });
});

const createOfficial = asyncHandler(async (req, res) => {
  const { fullName, email, phone, password, assignedCentreId } = req.body;

  const existing = await NhisOfficial.findOne({
    email: email.trim().toLowerCase(),
  });

  if (existing) {
    throw new ApiError(409, "Email already in use");
  }

  let centreId = assignedCentreId;
  if (!centreId) {
    const centre = await getDefaultCentre();
    centreId = centre._id;
  }

  const official = await NhisOfficial.create({
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    password,
    assignedCentreId: centreId,
  });

  await official.populate(officialPopulate);

  res.status(201).json({
    success: true,
    message:
      "NHIS official created. They can sign in at the official portal with their email and password.",
    official,
  });
});

const updateOfficial = asyncHandler(async (req, res) => {
  const { fullName, email, phone, isActive, password, assignedCentreId } = req.body;

  const official = await NhisOfficial.findById(req.params.id).select("+password");

  if (!official) {
    throw new ApiError(404, "NHIS official not found");
  }

  if (email && email !== official.email) {
    const existingEmail = await NhisOfficial.findOne({
      email: email.trim().toLowerCase(),
      _id: { $ne: official._id },
    });

    if (existingEmail) {
      throw new ApiError(409, "Email already in use");
    }

    official.email = email.trim().toLowerCase();
  }

  if (fullName) official.fullName = fullName.trim();
  if (phone) official.phone = phone.trim();
  if (typeof isActive === "boolean") official.isActive = isActive;
  if (assignedCentreId) official.assignedCentreId = assignedCentreId;
  if (password) official.password = password;

  await official.save();
  await official.populate(officialPopulate);

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
  const [totalOfficials, activeOfficials, inactiveOfficials] = await Promise.all([
    NhisOfficial.countDocuments(),
    NhisOfficial.countDocuments({ isActive: true }),
    NhisOfficial.countDocuments({ isActive: false }),
  ]);

  res.status(200).json({
    success: true,
    stats: {
      total: totalOfficials,
      active: activeOfficials,
      inactive: inactiveOfficials,
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
