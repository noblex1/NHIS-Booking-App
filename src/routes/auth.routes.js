const express = require("express");
const {
  login,
  register,
  verifyOtp,
  resendOtp,
  requestPasswordChangeOTP,
  verifyPasswordChangeOTP,
  changePassword,
  requestPasswordReset,
  resetPassword,
} = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");
const { otpRateLimiter, loginRateLimiter } = require("../middlewares/rateLimit.middleware");
const { requireAuth } = require("../middlewares/auth.middleware");
const {
  registerValidator,
  loginValidator,
  otpVerifyValidator,
  resendOtpValidator,
  passwordOtpValidator,
  changePasswordValidator,
  resetPasswordRequestValidator,
  resetPasswordValidator,
} = require("../utils/validators");

const router = express.Router();

router.post("/login", loginRateLimiter, loginValidator, validate, login);
router.post("/register", otpRateLimiter, registerValidator, validate, register);
router.post("/verify-otp", otpRateLimiter, otpVerifyValidator, validate, verifyOtp);
router.post("/resend-otp", otpRateLimiter, resendOtpValidator, validate, resendOtp);

// Password change routes (require authentication)
router.post("/request-password-change-otp", requireAuth, otpRateLimiter, requestPasswordChangeOTP);
router.post("/verify-password-change-otp", requireAuth, otpRateLimiter, passwordOtpValidator, validate, verifyPasswordChangeOTP);
router.post("/change-password", requireAuth, changePasswordValidator, validate, changePassword);

// Password reset routes (no authentication required)
router.post("/request-password-reset", otpRateLimiter, resetPasswordRequestValidator, validate, requestPasswordReset);
router.post("/reset-password", otpRateLimiter, resetPasswordValidator, validate, resetPassword);

module.exports = router;
