const express = require("express");
const { adminAuth, superAdminAuth } = require("../middlewares/admin.middleware");
const { adminLogin, getAdminProfile } = require("../controllers/admin.auth.controller");
const { getDashboardStats } = require("../controllers/admin.dashboard.controller");
const {
  getAllUsers,
  getUserById,
  updateUser,
  bulkDeleteUsers,
  deleteUser,
  getUserStats,
} = require("../controllers/admin.users.controller");
const {
  getSchedule,
  setScheduleRule,
  deleteScheduleRule,
} = require("../controllers/admin.schedule.controller");
const {
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  deleteAppointment,
  getAppointmentStats,
} = require("../controllers/admin.appointments.controller");
const {
  getAllOfficials,
  getOfficialById,
  createOfficial,
  updateOfficial,
  deleteOfficial,
  getOfficialStats,
} = require("../controllers/admin.officials.controller");
const validate = require("../middlewares/validate.middleware");
const { body, param, query } = require("express-validator");

const router = express.Router();

// ============================================================================
// Admin Auth Routes (Public)
// ============================================================================

router.post(
  "/auth/login",
  [
    body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    validate,
  ],
  adminLogin,
);

// ============================================================================
// Admin Profile Routes (Protected)
// ============================================================================

router.get("/auth/profile", adminAuth, getAdminProfile);

// ============================================================================
// Dashboard Routes (Protected)
// ============================================================================

router.get("/dashboard/stats", adminAuth, getDashboardStats);

// ============================================================================
// User Management Routes (Protected)
// ============================================================================

router.get(
  "/users",
  adminAuth,
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    query("search").optional().isString(),
    query("status").optional().isIn(["all", "verified", "unverified"]),
    validate,
  ],
  getAllUsers,
);

router.get("/users/stats", adminAuth, getUserStats);

router.post(
  "/users/bulk-delete",
  adminAuth,
  [
    body("ids").isArray({ min: 1 }).withMessage("ids must be a non-empty array"),
    body("ids.*").isMongoId().withMessage("Each id must be valid"),
    validate,
  ],
  bulkDeleteUsers,
);

router.get(
  "/users/:id",
  adminAuth,
  [param("id").isMongoId().withMessage("Invalid user ID"), validate],
  getUserById,
);

router.put(
  "/users/:id",
  adminAuth,
  [
    param("id").isMongoId().withMessage("Invalid user ID"),
    body("fullName").optional().trim().notEmpty(),
    body("email").optional().isEmail().normalizeEmail(),
    body("dateOfBirth").optional().isISO8601(),
    body("isVerified").optional().isBoolean(),
    validate,
  ],
  updateUser,
);

router.delete(
  "/users/:id",
  adminAuth,
  [param("id").isMongoId().withMessage("Invalid user ID"), validate],
  deleteUser,
);

// ============================================================================
// Appointment Management Routes (Protected)
// ============================================================================

router.get(
  "/appointments",
  adminAuth,
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    query("status").optional().isString(),
    query("date").optional().isISO8601(),
    query("search").optional().isString(),
    validate,
  ],
  getAllAppointments,
);

router.get("/appointments/stats", adminAuth, getAppointmentStats);

router.get(
  "/appointments/:id",
  adminAuth,
  [param("id").isMongoId().withMessage("Invalid appointment ID"), validate],
  getAppointmentById,
);

router.put(
  "/appointments/:id/status",
  adminAuth,
  [
    param("id").isMongoId().withMessage("Invalid appointment ID"),
    body("status").isIn(["Confirmed", "Pending", "Cancelled"]).withMessage("Invalid status"),
    validate,
  ],
  updateAppointmentStatus,
);

router.delete(
  "/appointments/:id",
  adminAuth,
  [param("id").isMongoId().withMessage("Invalid appointment ID"), validate],
  deleteAppointment,
);

// ============================================================================
// Booking schedule (availability) routes
// ============================================================================

router.get(
  "/schedule",
  adminAuth,
  [
    query("from").notEmpty().withMessage("from is required"),
    query("to").notEmpty().withMessage("to is required"),
    validate,
  ],
  getSchedule,
);

router.put(
  "/schedule",
  adminAuth,
  [
    body("date").isISO8601().withMessage("Valid date is required"),
    body("type").isIn(["blocked", "open"]).withMessage("type must be blocked or open"),
    body("reason").optional().isString(),
    validate,
  ],
  setScheduleRule,
);

router.delete(
  "/schedule/:date",
  adminAuth,
  [param("date").matches(/^\d{4}-\d{2}-\d{2}$/).withMessage("date must be YYYY-MM-DD"), validate],
  deleteScheduleRule,
);

// ============================================================================
// NHIS Officials Management Routes (Protected)
// ============================================================================

router.get(
  "/officials",
  adminAuth,
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    query("search").optional().isString(),
    query("status").optional().isIn(["all", "active", "inactive"]),
    validate,
  ],
  getAllOfficials,
);

router.get("/officials/stats", adminAuth, getOfficialStats);

router.get(
  "/officials/:id",
  adminAuth,
  [param("id").isMongoId().withMessage("Invalid official ID"), validate],
  getOfficialById,
);

router.post(
  "/officials",
  adminAuth,
  [
    body("fullName").trim().notEmpty().withMessage("Full name is required"),
    body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
    body("phone").trim().notEmpty().withMessage("Phone is required"),
    body("employeeId").trim().notEmpty().withMessage("Employee ID is required"),
    body("department").trim().notEmpty().withMessage("Department is required"),
    body("position").trim().notEmpty().withMessage("Position is required"),
    validate,
  ],
  createOfficial,
);

router.put(
  "/officials/:id",
  adminAuth,
  [
    param("id").isMongoId().withMessage("Invalid official ID"),
    body("fullName").optional().trim().notEmpty(),
    body("email").optional().isEmail().normalizeEmail(),
    body("phone").optional().trim().notEmpty(),
    body("employeeId").optional().trim().notEmpty(),
    body("department").optional().trim().notEmpty(),
    body("position").optional().trim().notEmpty(),
    body("isActive").optional().isBoolean(),
    validate,
  ],
  updateOfficial,
);

router.delete(
  "/officials/:id",
  adminAuth,
  [param("id").isMongoId().withMessage("Invalid official ID"), validate],
  deleteOfficial,
);

module.exports = router;
