const jwt = require("jsonwebtoken");
const NhisOfficial = require("../models/NhisOfficial");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const signOfficialToken = (official) => {
  const centreId =
    official.assignedCentreId?._id?.toString() ||
    official.assignedCentreId?.toString();

  return jwt.sign(
    {
      id: official._id,
      email: official.email,
      centreId,
      type: "official",
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );
};

const officialLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const cleanEmail = email.trim().toLowerCase();

  const official = await NhisOfficial.findOne({
    email: cleanEmail,
    isActive: true,
  })
    .select("+password")
    .populate("assignedCentreId", "name code address city region phone");

  if (!official) {
    throw new ApiError(401, "Invalid email or password");
  }

  const valid = await official.comparePassword(password);
  if (!valid) {
    throw new ApiError(401, "Invalid email or password");
  }

  official.lastLoginAt = new Date();
  await official.save({ validateBeforeSave: false });

  const token = signOfficialToken(official);
  const officialSafe = await NhisOfficial.findById(official._id)
    .populate("assignedCentreId", "name code address city region phone");

  res.status(200).json({
    success: true,
    message: "Official login successful",
    token,
    official: officialSafe,
  });
});

const getOfficialProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    official: req.official,
  });
});

module.exports = {
  officialLogin,
  getOfficialProfile,
};
