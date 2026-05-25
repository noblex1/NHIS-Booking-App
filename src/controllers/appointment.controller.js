const Appointment = require("../models/Appointment");
const ServiceCentre = require("../models/ServiceCentre");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const {
  DEFAULT_TIME_SLOTS,
  APPOINTMENT_STATUS,
  NHIS_SERVICE_TYPES,
  NHIS_SERVICE_TYPE_VALUES,
} = require("../config/constants");
const {
  APPLICATION_STATUS,
  DOCUMENT_REQUIREMENTS,
  SERVICE_FEES,
} = require("../config/nhisApplication");
const { isPastDate, normalizeDateOnly } = require("../utils/date");
const { sendAppointmentConfirmation } = require("../services/email.service");
const { isDateBookable } = require("../services/bookingSchedule.service");
const { generateUniqueReferenceNumber } = require("../utils/referenceNumber");

function validateDocumentAcknowledgement(serviceType, acknowledged) {
  const requirements = DOCUMENT_REQUIREMENTS[serviceType] || [];
  const requiredIds = requirements.filter((doc) => doc.required).map((doc) => doc.id);
  const ackSet = new Set(acknowledged || []);
  const missing = requiredIds.filter((id) => !ackSet.has(id));
  if (missing.length > 0) {
    throw new ApiError(400, "Please confirm you have all required documents");
  }
}

const createAppointment = asyncHandler(async (req, res) => {
  const {
    date,
    timeSlot,
    serviceType,
    centreId,
    documentsAcknowledged,
    feePaymentReference,
  } = req.body;

  const normalizedDate = normalizeDateOnly(date);
  if (!normalizedDate) {
    throw new ApiError(400, "Invalid date");
  }

  if (isPastDate(normalizedDate)) {
    throw new ApiError(400, "Cannot book in the past");
  }

  const bookable = await isDateBookable(normalizedDate);
  if (!bookable) {
    throw new ApiError(400, "This date is not available for booking");
  }

  if (!DEFAULT_TIME_SLOTS.includes(timeSlot)) {
    throw new ApiError(400, "Invalid time slot");
  }

  const normalizedServiceType = serviceType || NHIS_SERVICE_TYPES.RENEWAL;
  if (!NHIS_SERVICE_TYPE_VALUES.includes(normalizedServiceType)) {
    throw new ApiError(400, "Invalid service type");
  }

  const centre = await ServiceCentre.findOne({ _id: centreId, isActive: true });
  if (!centre) {
    throw new ApiError(400, "Invalid or inactive service centre");
  }

  validateDocumentAcknowledgement(normalizedServiceType, documentsAcknowledged);

  const existing = await Appointment.findOne({
    centreId: centre._id,
    date: normalizedDate,
    timeSlot: timeSlot.trim(),
    status: { $ne: APPOINTMENT_STATUS.CANCELLED },
  });

  if (existing) {
    throw new ApiError(409, "Time slot already booked at this centre");
  }

  const referenceNumber = await generateUniqueReferenceNumber();
  const feeAmount = SERVICE_FEES[normalizedServiceType] ?? 0;

  const appointment = await Appointment.create({
    userId: req.user._id,
    centreId: centre._id,
    date: normalizedDate,
    timeSlot: timeSlot.trim(),
    serviceType: normalizedServiceType,
    status: APPOINTMENT_STATUS.CONFIRMED,
    applicationStatus: APPLICATION_STATUS.SUBMITTED,
    referenceNumber,
    feeAmount,
    feePaid: feeAmount === 0,
    feePaymentReference: (feePaymentReference || "").trim(),
    documentsAcknowledged: documentsAcknowledged || [],
  });

  await appointment.populate("centreId", "name address city region code");

  await sendAppointmentConfirmation(req.user.email, {
    date: normalizedDate.toISOString().slice(0, 10),
    timeSlot: timeSlot.trim(),
    serviceType: normalizedServiceType,
    referenceNumber,
    centreName: centre.name,
    feeAmount,
  });

  res.status(201).json({
    success: true,
    message: "Application submitted and centre visit booked",
    appointment,
  });
});

const getMyAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ userId: req.user._id })
    .populate("centreId", "name address city region code phone")
    .sort({ date: -1, createdAt: -1 })
    .select("-__v");

  res.status(200).json({
    success: true,
    appointments,
  });
});

const getAvailableSlots = asyncHandler(async (req, res) => {
  const normalizedDate = normalizeDateOnly(req.query.date);
  const { centreId } = req.query;

  if (!normalizedDate) {
    throw new ApiError(400, "Invalid date");
  }

  if (!centreId) {
    throw new ApiError(400, "centreId is required");
  }

  const centre = await ServiceCentre.findOne({ _id: centreId, isActive: true });
  if (!centre) {
    throw new ApiError(400, "Invalid service centre");
  }

  const bookable = await isDateBookable(normalizedDate);
  if (!bookable) {
    return res.status(200).json({
      success: true,
      date: normalizedDate.toISOString().slice(0, 10),
      availableSlots: [],
      bookedSlots: [],
      dateUnavailable: true,
    });
  }

  const booked = await Appointment.find({
    centreId: centre._id,
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
