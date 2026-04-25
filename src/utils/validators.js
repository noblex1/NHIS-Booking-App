const { body, query } = require("express-validator");

const phoneRegex = /^\+?[0-9\s-]{7,20}$/;
const nhisRegex = /^[A-Za-z0-9-]{6,20}$/;

const registerValidator = [
  body("fullName").trim().isLength({ min: 2, max: 100 }).withMessage("Full name is required"),
  body("dateOfBirth").isISO8601().withMessage("dateOfBirth must be a valid date (YYYY-MM-DD)"),
  body("phoneNumber")
    .trim()
    .matches(phoneRegex)
    .withMessage("phoneNumber must be a valid phone format"),
];

const loginValidator = [
  body("nhisNumber").trim().matches(nhisRegex).withMessage("Invalid NHIS number format"),
  body("dateOfBirth").isISO8601().withMessage("dateOfBirth must be a valid date (YYYY-MM-DD)"),
];

const otpVerifyValidator = [
  body("phoneNumber")
    .trim()
    .matches(phoneRegex)
    .withMessage("phoneNumber must be a valid phone format"),
  body("otpCode")
    .trim()
    .isLength({ min: 4, max: 8 })
    .isNumeric()
    .withMessage("otpCode must be a valid numeric code"),
];

const resendOtpValidator = [
  body("phoneNumber")
    .trim()
    .matches(phoneRegex)
    .withMessage("phoneNumber must be a valid phone format"),
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
