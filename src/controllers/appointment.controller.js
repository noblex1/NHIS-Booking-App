const Appointment = require("../models/Appointment");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { DEFAULT_TIME_SLOTS, APPOINTMENT_STATUS } = require("../config/constants");
const { isPastDate, normalizeDateOnly } = require("../utils/date");
const { sendAppointmentConfirmation } = require("../services/email.service");

const createAppointment = asyncHandler(async (req, res) => {
  const { date, timeSlot } = req.body;
  const normalizedDate = normalizeDateOnly(date);
  if (!normalizedDate) {
    throw new ApiError(400, "Invalid date");
  }

  if (isPastDate(normalizedDate)) {
    throw new ApiError(400, "Cannot book an appointment in the past");
  }

  if (!DEFAULT_TIME_SLOTS.includes(timeSlot)) {
    throw new ApiError(400, "Invalid time slot");
  }

  const existing = await Appointment.findOne({
    date: normalizedDate,
    timeSlot: timeSlot.trim(),
    status: { $ne: APPOINTMENT_STATUS.CANCELLED },
  });

  if (existing) {
    throw new ApiError(409, "Time slot already booked");
  }

  const appointment = await Appointment.create({
    userId: req.user._id,
    date: normalizedDate,
    timeSlot: timeSlot.trim(),
    status: APPOINTMENT_STATUS.CONFIRMED,
  });

  await sendAppointmentConfirmation(
    req.user.email,
    normalizedDate.toISOString().slice(0, 10),
    timeSlot,
  );

  res.status(201).json({
    success: true,
    message: "Appointment booked successfully",
    appointment,
  });
});

const getMyAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ userId: req.user._id })
    .sort({ date: -1, createdAt: -1 })
    .select("-__v");

  res.status(200).json({
    success: true,
    appointments,
  });
});

const getAvailableSlots = asyncHandler(async (req, res) => {
  const normalizedDate = normalizeDateOnly(req.query.date);
  if (!normalizedDate) {
    throw new ApiError(400, "Invalid date");
  }

  const booked = await Appointment.find({
    date: normalizedDate,
    status: { $ne: APPOINTMENT_STATUS.CANCELLED },
  }).select("timeSlot -_id");

  const bookedSet = new Set(booked.map((a) => a.timeSlot));
  const availableSlots = DEFAULT_TIME_SLOTS.filter((slot) => !bookedSet.has(slot));

  res.status(200).json({
    success: true,
    date: normalizedDate.toISOString().slice(0, 10),
    availableSlots,
    bookedSlots: [...bookedSet],
  });
});

module.exports = {
  createAppointment,
  getMyAppointments,
  getAvailableSlots,
};
