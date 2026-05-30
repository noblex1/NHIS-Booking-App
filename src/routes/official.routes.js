const express = require("express");
const { body, param, query } = require("express-validator");
const validate = require("../middlewares/validate.middleware");
const { officialAuth } = require("../middlewares/official.middleware");
const {
  officialLogin,
  getOfficialProfile,
} = require("../controllers/official.auth.controller");
const {
  getDashboardStats,
  getCentreAppointments,
  getAppointmentById,
  lookupByReference,
  checkInAppointment,
  updateApplication,
} = require("../controllers/official.appointments.controller");

const router = express.Router();

router.post(
  "/auth/login",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    validate,
  ],
  officialLogin,
);

router.get("/auth/profile", officialAuth, getOfficialProfile);

router.get(
  "/dashboard/stats",
  officialAuth,
  [query("date").optional().isISO8601().toDate()],
  getDashboardStats,
);

router.get(
  "/appointments",
  officialAuth,
  [
    query("date").optional().isISO8601().toDate(),
    query("applicationStatus").optional().isString(),
    query("serviceType")
      .optional()
      .isIn(["all", "new_registration", "renewal"]),
    query("timeSlot").optional().isIn(["all", "morning", "afternoon", "evening"]),
    query("search").optional().isString().trim(),
    validate,
  ],
  getCentreAppointments,
);

router.get(
  "/appointments/lookup",
  officialAuth,
  [query("reference").trim().notEmpty(), validate],
  lookupByReference,
);

router.get(
  "/appointments/:id",
  officialAuth,
  [param("id").isMongoId(), validate],
  getAppointmentById,
);

router.post(
  "/appointments/:id/check-in",
  officialAuth,
  [param("id").isMongoId(), validate],
  checkInAppointment,
);

router.put(
  "/appointments/:id/application",
  officialAuth,
  [
    param("id").isMongoId(),
    body("applicationStatus")
      .optional()
      .isIn(["submitted", "at_centre", "completed", "cancelled"]),
    body("feePaid").optional().isBoolean(),
    body("feePaymentReference").optional().isString(),
    body("assignNhisNumber").optional().isString(),
    validate,
  ],
  updateApplication,
);

module.exports = router;
