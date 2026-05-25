const Appointment = require("../models/Appointment");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { APPOINTMENT_STATUS } = require("../config/constants");
const { APPLICATION_STATUS, APPLICATION_STATUS_VALUES } = require("../config/nhisApplication");
const { generateUniqueNhisNumber } = require("../utils/nhis");

const getAllAppointments = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status = "all", date = "", search = "" } = req.query;

  const query = {};

  if (status !== "all" && Object.values(APPOINTMENT_STATUS).includes(status)) {
    query.status = status;
  }

  if (date) {
    const targetDate = new Date(date);
    query.date = {
      $gte: new Date(targetDate.setHours(0, 0, 0, 0)),
      $lt: new Date(targetDate.setHours(23, 59, 59, 999)),
    };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  let appointments = await Appointment.find(query)
    .populate("userId", "fullName email nhisNumber")
    .populate("centreId", "name city region code")
    .sort({ date: -1, createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  if (search) {
    const searchLower = search.toLowerCase();
    appointments = appointments.filter((apt) => {
      const user = apt.userId;
      const centre = apt.centreId;
      return (
        apt.referenceNumber?.toLowerCase().includes(searchLower) ||
        user?.fullName?.toLowerCase().includes(searchLower) ||
        user?.email?.toLowerCase().includes(searchLower) ||
        user?.nhisNumber?.toLowerCase().includes(searchLower) ||
        centre?.name?.toLowerCase().includes(searchLower)
      );
    });
  }

  const total = await Appointment.countDocuments(query);

  res.status(200).json({
    success: true,
    appointments,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate("userId", "fullName email nhisNumber")
    .populate("centreId", "name address city region code phone");

  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  res.status(200).json({
    success: true,
    appointment,
  });
});

const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!Object.values(APPOINTMENT_STATUS).includes(status)) {
    throw new ApiError(400, "Invalid appointment status");
  }

  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  appointment.status = status;
  if (status === APPOINTMENT_STATUS.CANCELLED) {
    appointment.applicationStatus = APPLICATION_STATUS.CANCELLED;
  }
  await appointment.save();

  await appointment.populate("userId", "fullName email nhisNumber");
  await appointment.populate("centreId", "name city region");

  res.status(200).json({
    success: true,
    message: "Appointment status updated successfully",
    appointment,
  });
});

const updateApplication = asyncHandler(async (req, res) => {
  const { applicationStatus, feePaid, feePaymentReference, assignNhisNumber } = req.body;

  const appointment = await Appointment.findById(req.params.id).populate("userId");

  if (!appointment) {
    throw new ApiError(404, "Application not found");
  }

  if (applicationStatus) {
    if (!APPLICATION_STATUS_VALUES.includes(applicationStatus)) {
      throw new ApiError(400, "Invalid application status");
    }
    appointment.applicationStatus = applicationStatus;
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
    } else if (assignNhisNumber?.trim()) {
      user.nhisNumber = assignNhisNumber.trim();
      await user.save();
    }
  }

  await appointment.save();
  await appointment.populate("userId", "fullName email nhisNumber");
  await appointment.populate("centreId", "name city region code");

  res.status(200).json({
    success: true,
    message: "Application updated",
    appointment,
  });
});

const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  await appointment.deleteOne();

  res.status(200).json({
    success: true,
    message: "Appointment deleted successfully",
  });
});

const getAppointmentStats = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalAppointments,
    confirmedAppointments,
    pendingAppointments,
    cancelledAppointments,
    todayAppointments,
    upcomingAppointments,
  ] = await Promise.all([
    Appointment.countDocuments(),
    Appointment.countDocuments({ status: APPOINTMENT_STATUS.CONFIRMED }),
    Appointment.countDocuments({ status: APPOINTMENT_STATUS.PENDING }),
    Appointment.countDocuments({ status: APPOINTMENT_STATUS.CANCELLED }),
    Appointment.countDocuments({
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
    }),
    Appointment.countDocuments({
      date: { $gte: today },
      status: { $ne: APPOINTMENT_STATUS.CANCELLED },
    }),
  ]);

  res.status(200).json({
    success: true,
    stats: {
      total: totalAppointments,
      confirmed: confirmedAppointments,
      pending: pendingAppointments,
      cancelled: cancelledAppointments,
      today: todayAppointments,
      upcoming: upcomingAppointments,
    },
  });
});

module.exports = {
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  updateApplication,
  deleteAppointment,
  getAppointmentStats,
};
