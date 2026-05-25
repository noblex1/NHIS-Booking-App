const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { signAuthToken } = require("../utils/jwt");
const { createAndSendOtp, verifyOtpCode } = require("../services/otp.service");

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const cleanEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    email: cleanEmail,
    isVerified: true,
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
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
  const { fullName, email, password } = req.body;
  const cleanEmail = email.trim().toLowerCase();

  const existingVerified = await User.findOne({
    email: cleanEmail,
    isVerified: true,
  });

  if (existingVerified) {
    throw new ApiError(409, "User already exists. Please login.");
  }

  await User.deleteOne({ email: cleanEmail, isVerified: false });

  await User.create({
    fullName: fullName.trim(),
    email: cleanEmail,
    password,
    isVerified: false,
  });

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

  user.isVerified = true;
  await user.save();

  const token = signAuthToken(user);

  res.status(200).json({
    success: true,
    message: "Account verified successfully",
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
