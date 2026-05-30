const { body, query } = require("express-validator");

const registerValidator = [
  body("fullName").trim().isLength({ min: 2, max: 100 }).withMessage("Full name is required"),
  body("email").trim().isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

const loginValidator = [
  body("email").trim().isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const otpVerifyValidator = [
  body("email").trim().isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("otpCode")
    .trim()
    .isLength({ min: 4, max: 8 })
    .isNumeric()
    .withMessage("otpCode must be a valid numeric code"),
];

const resendOtpValidator = [
  body("email").trim().isEmail().normalizeEmail().withMessage("Valid email is required"),
];

const createAppointmentValidator = [
  body("date").isISO8601().withMessage("date must be a valid date (YYYY-MM-DD)"),
  body("timeSlot")
    .isIn(["morning", "afternoon", "evening"])
    .withMessage("timeSlot must be morning, afternoon, or evening"),
  body("serviceType")
    .isIn(["new_registration", "renewal"])
    .withMessage("serviceType must be new_registration or renewal"),
  body("documentsAcknowledged").isArray({ min: 1 }).withMessage("documentsAcknowledged is required"),
  body("feePaymentReference").optional().isString(),
];

const scheduleRangeValidator = [
  query("from").notEmpty().withMessage("from is required"),
  query("to").notEmpty().withMessage("to is required"),
];

const availableSlotsValidator = [
  query("date").isISO8601().withMessage("date query param must be YYYY-MM-DD"),
];

const passwordOtpValidator = [
  body("otp")
    .trim()
    .isLength({ min: 4, max: 8 })
    .isNumeric()
    .withMessage("otp must be a valid numeric code"),
];

const changePasswordValidator = [
  ...passwordOtpValidator,
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),
];

const resetPasswordRequestValidator = [
  body("email").trim().isEmail().normalizeEmail().withMessage("Valid email is required"),
];

const resetPasswordValidator = [
  body("email").trim().isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("otp")
    .trim()
    .isLength({ min: 4, max: 8 })
    .isNumeric()
    .withMessage("otp must be a valid numeric code"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),
];

module.exports = {
  registerValidator,
  loginValidator,
  otpVerifyValidator,
  resendOtpValidator,
  createAppointmentValidator,
  scheduleRangeValidator,
  availableSlotsValidator,
  passwordOtpValidator,
  changePasswordValidator,
  resetPasswordRequestValidator,
  resetPasswordValidator,
};
