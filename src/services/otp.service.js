const OTP = require("../models/OTP");
const ApiError = require("../utils/ApiError");
const { generateOtpCode, getOtpExpiryDate, hashOtp } = require("../utils/otp");
const { sendOtpEmail } = require("./email.service");

async function createAndSendOtp(email) {
  const otpCode = generateOtpCode();
  const expiresAt = getOtpExpiryDate();

  await OTP.deleteMany({ email });
  await OTP.create({
    email,
    otpHash: hashOtp(otpCode),
    expiresAt,
  });

  await sendOtpEmail(email, otpCode);
}

async function verifyOtpCode(email, otpCode) {
  const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 });
  if (!otpRecord) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  if (otpRecord.expiresAt < new Date()) {
    await OTP.deleteMany({ email });
    throw new ApiError(400, "Invalid or expired OTP");
  }

  const maxAttempts = Number(process.env.OTP_MAX_ATTEMPTS) || 5;
  if (otpRecord.attempts >= maxAttempts) {
    await OTP.deleteMany({ email });
    throw new ApiError(429, "OTP attempts exceeded. Request a new OTP.");
  }

  if (otpRecord.otpHash !== hashOtp(otpCode)) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    throw new ApiError(400, "Invalid or expired OTP");
  }

  await OTP.deleteMany({ email });
}

module.exports = {
  createAndSendOtp,
  verifyOtpCode,
};
