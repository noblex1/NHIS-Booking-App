const express = require("express");
const {
  getPreferences,
  updatePreferences,
} = require("../controllers/notifications.controller");
const { requireAuth } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { body } = require("express-validator");

const router = express.Router();

const updatePreferencesValidator = [
  body("emailNotifications").optional().isBoolean().withMessage("emailNotifications must be a boolean"),
  body("appointmentReminders").optional().isBoolean().withMessage("appointmentReminders must be a boolean"),
  body("statusUpdates").optional().isBoolean().withMessage("statusUpdates must be a boolean"),
  body("promotions").optional().isBoolean().withMessage("promotions must be a boolean"),
];

router.get("/preferences", requireAuth, getPreferences);
router.put("/preferences", requireAuth, updatePreferencesValidator, validate, updatePreferences);

module.exports = router;
