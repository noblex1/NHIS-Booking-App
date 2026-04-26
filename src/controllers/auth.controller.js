const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { signAuthToken } = require("../utils/jwt");
const { normalizeDateOnly } = require("../utils/date");
const { generateUniqueNhisNumber } = require("../utils/nhis");
const { createAndSendOtp, verifyOtpCode } = require("../services/otp.service");

const login = asyncHandler(async (req, res) => {
  const { nhisNumber, dateOfBirth } = req.body;
  const normalizedDob = normalizeDateOnly(dateOfBirth);
  if (!normalizedDob) {
    throw new ApiError(400, "Invalid dateOfBirth");
  }

  const user = await User.findOne({
    nhisNumber: nhisNumber.trim(),
    dateOfBirth: normalizedDob,
    isVerified: true,
  }).select("-__v");

  if (!user) {
    throw new ApiError(401, "Invalid NHIS number or DOB");
  }

  const token = signAuthToken(user);
  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user,
  });
});

const register = asyncHandler(async (req, res) => {
  const { fullName, dateOfBirth, email } = req.body;
  const normalizedDob = normalizeDateOnly(dateOfBirth);
  if (!normalizedDob) {
    throw new ApiError(400, "Invalid dateOfBirth");
  }

  const cleanEmail = email.trim().toLowerCase();

  const existingVerified = await User.findOne({
    email: cleanEmail,
    isVerified: true,
  });

  if (existingVerified) {
    throw new ApiError(409, "User already exists. Please login.");
  }

  await User.findOneAndUpdate(
    { email: cleanEmail },
    {
      $set: {
        fullName: fullName.trim(),
        dateOfBirth: normalizedDob,
        email: cleanEmail,
        isVerified: false,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  await createAndSendOtp(cleanEmail);

  res.status(200).json({
    success: true,
    message: "OTP sent to your email",
  });
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otpCode } = req.body;
  const cleanEmail = email.trim().toLowerCase();

  await verifyOtpCode(cleanEmail, otpCode.trim());

  const user = await User.findOne({ email: cleanEmail });
  if (!user) {
    throw new ApiError(404, "Registration not found. Please register first.");
  }

  if (!user.nhisNumber) {
    user.nhisNumber = await generateUniqueNhisNumber();
  }
  user.isVerified = true;
  await user.save();

  const token = signAuthToken(user);

  res.status(200).json({
    success: true,
    message: "OTP verified successfully",
    token,
    user,
  });
});

const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const cleanEmail = email.trim().toLowerCase();

  const user = await User.findOne({ email: cleanEmail, isVerified: false });
  if (!user) {
    throw new ApiError(404, "No pending registration for this email");
  }

  await createAndSendOtp(cleanEmail);

  res.status(200).json({
    success: true,
    message: "OTP resent successfully",
  });
});

module.exports = {
  login,
  register,
  verifyOtp,
  resendOtp,
};
