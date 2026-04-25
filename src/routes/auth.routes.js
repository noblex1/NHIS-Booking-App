const express = require("express");
const {
  login,
  register,
  verifyOtp,
  resendOtp,
} = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");
const { otpRateLimiter, loginRateLimiter } = require("../middlewares/rateLimit.middleware");
const {
  registerValidator,
  loginValidator,
  otpVerifyValidator,
  resendOtpValidator,
} = require("../utils/validators");

const router = express.Router();

router.post("/login", loginRateLimiter, loginValidator, validate, login);
router.post("/register", otpRateLimiter, registerValidator, validate, register);
router.post("/verify-otp", otpRateLimiter, otpVerifyValidator, validate, verifyOtp);
router.post("/resend-otp", otpRateLimiter, resendOtpValidator, validate, resendOtp);

module.exports = router;
