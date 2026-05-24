const Appointment = require("../models/Appointment");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { APPOINTMENT_STATUS } = require("../config/constants");

const getAllAppointments = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status = "all", date = "", search = "" } = req.query;
  
  const query = {};
  
  // Filter by status
  if (status !== "all" && Object.values(APPOINTMENT_STATUS).includes(status)) {
    query.status = status;
  }
  
  // Filter by date
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
    .sort({ date: -1, createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
  
  // Search by user name, email, or NHIS number if search term provided
  if (search) {
    appointments = appointments.filter(apt => {
      const user = apt.userId;
      if (!user) return false;
      const searchLower = search.toLowerCase();
      return (
        user.fullName?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.nhisNumber?.toLowerCase().includes(searchLower)
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
    .populate("userId", "fullName email nhisNumber dateOfBirth");
  
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
  await appointment.save();
  
  // Populate user data for response
  await appointment.populate("userId", "fullName email nhisNumber");
  
  res.status(200).json({
    success: true,
    message: "Appointment status updated successfully",
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
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    }),
    Appointment.countDocuments({ 
      date: { $gte: today },
      status: { $ne: APPOINTMENT_STATUS.CANCELLED }
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
  deleteAppointment,
  getAppointmentStats,
};
