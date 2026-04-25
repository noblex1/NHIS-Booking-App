const OTP = require("../models/OTP");
const ApiError = require("../utils/ApiError");
const { generateOtpCode, getOtpExpiryDate, hashOtp } = require("../utils/otp");
const { sendSMS } = require("./sms.service");

async function createAndSendOtp(phoneNumber) {
  const otpCode = generateOtpCode();
  const expiresAt = getOtpExpiryDate();

  await OTP.deleteMany({ phoneNumber });
  await OTP.create({
    phoneNumber,
    otpHash: hashOtp(otpCode),
    expiresAt,
  });

  await sendSMS(
    phoneNumber,
    `Your NHIS verification code is ${otpCode}. It expires in ${process.env.OTP_EXPIRY_MINUTES || 5} minutes.`,
  );
}

async function verifyOtpCode(phoneNumber, otpCode) {
  const otpRecord = await OTP.findOne({ phoneNumber }).sort({ createdAt: -1 });
  if (!otpRecord) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  if (otpRecord.expiresAt < new Date()) {
    await OTP.deleteMany({ phoneNumber });
    throw new ApiError(400, "Invalid or expired OTP");
  }

  const maxAttempts = Number(process.env.OTP_MAX_ATTEMPTS) || 5;
  if (otpRecord.attempts >= maxAttempts) {
    await OTP.deleteMany({ phoneNumber });
    throw new ApiError(429, "OTP attempts exceeded. Request a new OTP.");
  }

  if (otpRecord.otpHash !== hashOtp(otpCode)) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    throw new ApiError(400, "Invalid or expired OTP");
  }

  await OTP.deleteMany({ phoneNumber });
}

module.exports = {
  createAndSendOtp,
  verifyOtpCode,
};
