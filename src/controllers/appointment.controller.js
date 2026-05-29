const Appointment = require("../models/Appointment");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const {
  SLOT_PERIOD_IDS,
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
const { getDefaultCentre } = require("../services/centre.service");
const {
  getAvailabilityForDate,
  countBookedForPeriod,
  getMaxSlotsForPeriod,
} = require("../services/slotCapacity.service");

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
    documentsAcknowledged,
    feePaymentReference,
    beneficiaryName,
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

  const period = timeSlot?.trim();
  if (!SLOT_PERIOD_IDS.includes(period)) {
    throw new ApiError(400, "Invalid time period. Choose morning, afternoon, or evening");
  }

  const normalizedServiceType = serviceType || NHIS_SERVICE_TYPES.RENEWAL;
  if (!NHIS_SERVICE_TYPE_VALUES.includes(normalizedServiceType)) {
    throw new ApiError(400, "Invalid service type");
  }

  const centre = await getDefaultCentre();
  validateDocumentAcknowledgement(normalizedServiceType, documentsAcknowledged);

  const maxSlots = await getMaxSlotsForPeriod(normalizedDate, period);
  const booked = await countBookedForPeriod(normalizedDate, period, centre._id);
  if (booked >= maxSlots) {
    throw new ApiError(409, "This time period is fully booked. Please choose another slot");
  }

  const referenceNumber = await generateUniqueReferenceNumber();
  const feeAmount = SERVICE_FEES[normalizedServiceType] ?? 0;

  const appointment = await Appointment.create({
    userId: req.user._id,
    centreId: centre._id,
    date: normalizedDate,
    timeSlot: period,
    serviceType: normalizedServiceType,
    status: APPOINTMENT_STATUS.CONFIRMED,
    applicationStatus: APPLICATION_STATUS.SUBMITTED,
    referenceNumber,
    feeAmount,
    feePaid: feeAmount === 0,
    feePaymentReference: (feePaymentReference || "").trim(),
    documentsAcknowledged: documentsAcknowledged || [],
    beneficiaryName: beneficiaryName ? beneficiaryName.trim() : undefined,
  });

  await appointment.populate("centreId", "name address city region code");

  await sendAppointmentConfirmation(req.user.email, {
    date: normalizedDate.toISOString().slice(0, 10),
    timeSlot: period,
    serviceType: normalizedServiceType,
    referenceNumber,
    centreName: centre.name,
    feeAmount,
    userName: req.user.fullName,
    beneficiaryName: beneficiaryName ? beneficiaryName.trim() : undefined,
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
  if (!normalizedDate) {
    throw new ApiError(400, "Invalid date");
  }

  const bookable = await isDateBookable(normalizedDate);
  if (!bookable) {
    return res.status(200).json({
      success: true,
      date: normalizedDate.toISOString().slice(0, 10),
      periods: [],
      dateUnavailable: true,
    });
  }

  const centre = await getDefaultCentre();
  const periods = await getAvailabilityForDate(normalizedDate, centre._id);

  res.status(200).json({
    success: true,
    date: normalizedDate.toISOString().slice(0, 10),
    centre: {
      _id: centre._id,
      name: centre.name,
      city: centre.city,
      region: centre.region,
    },
    periods,
  });
});

module.exports = {
  createAppointment,
  getMyAppointments,
  getAvailableSlots,
};
