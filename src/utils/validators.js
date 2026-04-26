const { body, query } = require("express-validator");

const nhisRegex = /^[A-Za-z0-9-]{6,20}$/;

const registerValidator = [
  body("fullName").trim().isLength({ min: 2, max: 100 }).withMessage("Full name is required"),
  body("dateOfBirth").isISO8601().withMessage("dateOfBirth must be a valid date (YYYY-MM-DD)"),
  body("email").trim().isEmail().normalizeEmail().withMessage("Valid email is required"),
];

const loginValidator = [
  body("nhisNumber").trim().matches(nhisRegex).withMessage("Invalid NHIS number format"),
  body("dateOfBirth").isISO8601().withMessage("dateOfBirth must be a valid date (YYYY-MM-DD)"),
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
  body("timeSlot").trim().notEmpty().withMessage("timeSlot is required"),
];

const availableSlotsValidator = [
  query("date").isISO8601().withMessage("date query param must be YYYY-MM-DD"),
];

module.exports = {
  registerValidator,
  loginValidator,
  otpVerifyValidator,
  resendOtpValidator,
  createAppointmentValidator,
  availableSlotsValidator,
};
