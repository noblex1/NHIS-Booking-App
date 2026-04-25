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
  const { fullName, dateOfBirth, phoneNumber } = req.body;
  const normalizedDob = normalizeDateOnly(dateOfBirth);
  if (!normalizedDob) {
    throw new ApiError(400, "Invalid dateOfBirth");
  }

  const existingVerified = await User.findOne({
    phoneNumber: phoneNumber.trim(),
    isVerified: true,
  });

  if (existingVerified) {
    throw new ApiError(409, "User already exists. Please login.");
  }

  await User.findOneAndUpdate(
    { phoneNumber: phoneNumber.trim() },
    {
      $set: {
        fullName: fullName.trim(),
        dateOfBirth: normalizedDob,
        phoneNumber: phoneNumber.trim(),
        isVerified: false,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  await createAndSendOtp(phoneNumber.trim());

  res.status(200).json({
    success: true,
    message: "OTP sent successfully",
  });
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { phoneNumber, otpCode } = req.body;
  const cleanPhone = phoneNumber.trim();

  await verifyOtpCode(cleanPhone, otpCode.trim());

  const user = await User.findOne({ phoneNumber: cleanPhone });
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
  const { phoneNumber } = req.body;
  const cleanPhone = phoneNumber.trim();

  const user = await User.findOne({ phoneNumber: cleanPhone, isVerified: false });
  if (!user) {
    throw new ApiError(404, "No pending registration for this phone number");
  }

  await createAndSendOtp(cleanPhone);

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
