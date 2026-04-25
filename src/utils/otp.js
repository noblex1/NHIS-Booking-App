const crypto = require("crypto");

function getOtpLength() {
  const n = Number(process.env.OTP_LENGTH);
  if (!Number.isFinite(n) || n < 4 || n > 8) return 6;
  return n;
}

function generateOtpCode() {
  const length = getOtpLength();
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return `${Math.floor(min + Math.random() * (max - min + 1))}`;
}

function hashOtp(code) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

function getOtpExpiryDate() {
  const mins = Number(process.env.OTP_EXPIRY_MINUTES) || 5;
  return new Date(Date.now() + mins * 60 * 1000);
}

module.exports = {
  generateOtpCode,
  hashOtp,
  getOtpExpiryDate,
};
