const express = require("express");
const {
  createAppointment,
  getMyAppointments,
  getAvailableSlots,
} = require("../controllers/appointment.controller");
const { requireAuth } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  createAppointmentValidator,
  availableSlotsValidator,
} = require("../utils/validators");

const router = express.Router();

router.get("/available", availableSlotsValidator, validate, getAvailableSlots);
router.post("/", requireAuth, createAppointmentValidator, validate, createAppointment);
router.get("/", requireAuth, getMyAppointments);

module.exports = router;
