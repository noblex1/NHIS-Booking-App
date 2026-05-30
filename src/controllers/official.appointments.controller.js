const Appointment = require("../models/Appointment");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { normalizeDateOnly } = require("../utils/date");
const { generateUniqueNhisNumber } = require("../utils/nhis");
const {
  APPLICATION_STATUS,
} = require("../config/nhisApplication");
const { APPOINTMENT_STATUS, NHIS_SERVICE_TYPE_VALUES, SLOT_PERIOD_IDS } = require("../config/constants");

const APPLICATION_STATUS_VALUES = Object.values(APPLICATION_STATUS);

function getOfficialCentreId(official) {
  return official.assignedCentreId?._id || official.assignedCentreId;
}

function dayRange(dateInput) {
  const day = normalizeDateOnly(dateInput || new Date());
  if (!day) {
    throw new ApiError(400, "Invalid date");
  }
  const end = new Date(day);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start: day, end };
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function findScopedAppointment(id, centreId) {
  const appointment = await Appointment.findOne({
    _id: id,
    centreId,
  })
    .populate("userId", "fullName email nhisNumber phone")
    .populate("centreId", "name code city region address phone")
    .populate("processedByOfficialId", "fullName");

  if (!appointment) {
    throw new ApiError(404, "Appointment not found at your service centre");
  }

  return appointment;
}

const getDashboardStats = asyncHandler(async (req, res) => {
  const centreId = getOfficialCentreId(req.official);
  const { start, end } = dayRange(req.query.date);

  const base = {
    centreId,
    date: { $gte: start, $lt: end },
    status: { $ne: APPOINTMENT_STATUS.CANCELLED },
  };

  const [totalToday, submitted, atCentre, completed] = await Promise.all([
    Appointment.countDocuments(base),
    Appointment.countDocuments({
      ...base,
      applicationStatus: APPLICATION_STATUS.SUBMITTED,
    }),
    Appointment.countDocuments({
      ...base,
      applicationStatus: APPLICATION_STATUS.AT_CENTRE,
    }),
    Appointment.countDocuments({
      ...base,
      applicationStatus: APPLICATION_STATUS.COMPLETED,
    }),
  ]);

  res.status(200).json({
    success: true,
    date: start.toISOString().slice(0, 10),
    stats: {
      totalToday,
      awaitingCheckIn: submitted,
      atCentre,
      completed,
    },
  });
});

const getCentreAppointments = asyncHandler(async (req, res) => {
  const centreId = getOfficialCentreId(req.official);
  const { start, end } = dayRange(req.query.date);
  const {
    applicationStatus,
    serviceType,
    timeSlot,
    search = "",
  } = req.query;

  const query = {
    centreId,
    date: { $gte: start, $lt: end },
  };

  if (
    applicationStatus &&
    applicationStatus !== "all" &&
    APPLICATION_STATUS_VALUES.includes(applicationStatus)
  ) {
    query.applicationStatus = applicationStatus;
  }

  if (serviceType && serviceType !== "all" && NHIS_SERVICE_TYPE_VALUES.includes(serviceType)) {
    query.serviceType = serviceType;
  }

  if (timeSlot && timeSlot !== "all" && SLOT_PERIOD_IDS.includes(timeSlot)) {
    query.timeSlot = timeSlot;
  }

  const term = String(search).trim();
  if (term) {
    const regex = new RegExp(escapeRegex(term), "i");
    const matchingUsers = await User.find({
      $or: [{ fullName: regex }, { email: regex }, { nhisNumber: regex }],
    }).select("_id");
    const userIds = matchingUsers.map((u) => u._id);

    query.$or = [
      { referenceNumber: regex },
      { beneficiaryName: regex },
      ...(userIds.length > 0 ? [{ userId: { $in: userIds } }] : []),
    ];
  }

  const [appointments, totalForDate] = await Promise.all([
    Appointment.find(query)
      .populate("userId", "fullName email nhisNumber")
      .populate("centreId", "name city region")
      .sort({ timeSlot: 1, createdAt: 1 }),
    Appointment.countDocuments({
      centreId,
      date: { $gte: start, $lt: end },
    }),
  ]);

  res.status(200).json({
    success: true,
    date: start.toISOString().slice(0, 10),
    appointments,
    meta: {
      total: appointments.length,
      totalForDate,
    },
  });
});

const getAppointmentById = asyncHandler(async (req, res) => {
  const centreId = getOfficialCentreId(req.official);
  const appointment = await findScopedAppointment(req.params.id, centreId);

  res.status(200).json({
    success: true,
    appointment,
  });
});

const lookupByReference = asyncHandler(async (req, res) => {
  const centreId = getOfficialCentreId(req.official);
  const ref = String(req.query.reference || "")
    .trim()
    .toUpperCase();

  if (!ref) {
    throw new ApiError(400, "Reference number is required");
  }

  const appointment = await Appointment.findOne({
    centreId,
    referenceNumber: ref,
  })
    .populate("userId", "fullName email nhisNumber")
    .populate("centreId", "name city region");

  if (!appointment) {
    throw new ApiError(404, "No booking found with this reference at your centre");
  }

  res.status(200).json({
    success: true,
    appointment,
  });
});

const checkInAppointment = asyncHandler(async (req, res) => {
  const centreId = getOfficialCentreId(req.official);
  const appointment = await findScopedAppointment(req.params.id, centreId);

  if (appointment.applicationStatus === APPLICATION_STATUS.CANCELLED) {
    throw new ApiError(400, "This application was cancelled");
  }

  if (appointment.applicationStatus === APPLICATION_STATUS.COMPLETED) {
    throw new ApiError(400, "This application is already completed");
  }

  appointment.applicationStatus = APPLICATION_STATUS.AT_CENTRE;
  appointment.checkedInAt = new Date();
  appointment.processedByOfficialId = req.official._id;
  await appointment.save();

  res.status(200).json({
    success: true,
    message: "Applicant checked in at centre",
    appointment,
  });
});

const updateApplication = asyncHandler(async (req, res) => {
  const centreId = getOfficialCentreId(req.official);
  const { applicationStatus, feePaid, feePaymentReference, assignNhisNumber } =
    req.body;

  const appointment = await Appointment.findOne({
    _id: req.params.id,
    centreId,
  }).populate("userId");

  if (!appointment) {
    throw new ApiError(404, "Appointment not found at your service centre");
  }

  if (applicationStatus) {
    if (!APPLICATION_STATUS_VALUES.includes(applicationStatus)) {
      throw new ApiError(400, "Invalid application status");
    }
    appointment.applicationStatus = applicationStatus;

    if (applicationStatus === APPLICATION_STATUS.AT_CENTRE && !appointment.checkedInAt) {
      appointment.checkedInAt = new Date();
    }

    if (applicationStatus === APPLICATION_STATUS.COMPLETED) {
      appointment.completedAt = new Date();
    }

    if (applicationStatus === APPLICATION_STATUS.CANCELLED) {
      appointment.status = APPOINTMENT_STATUS.CANCELLED;
    }
  }

  if (typeof feePaid === "boolean") {
    appointment.feePaid = feePaid;
  }

  if (feePaymentReference !== undefined) {
    appointment.feePaymentReference = String(feePaymentReference).trim();
  }

  if (applicationStatus === APPLICATION_STATUS.COMPLETED && appointment.userId) {
    const user = await User.findById(appointment.userId._id);
    if (user && !user.nhisNumber) {
      user.nhisNumber = assignNhisNumber?.trim() || (await generateUniqueNhisNumber());
      await user.save();
    } else if (assignNhisNumber?.trim() && user) {
      user.nhisNumber = assignNhisNumber.trim();
      await user.save();
    }
  }

  appointment.processedByOfficialId = req.official._id;
  await appointment.save();

  await appointment.populate("userId", "fullName email nhisNumber");
  await appointment.populate("centreId", "name city region code");
  await appointment.populate("processedByOfficialId", "fullName");

  res.status(200).json({
    success: true,
    message: "Application updated",
    appointment,
  });
});

module.exports = {
  getDashboardStats,
  getCentreAppointments,
  getAppointmentById,
  lookupByReference,
  checkInAppointment,
  updateApplication,
};
