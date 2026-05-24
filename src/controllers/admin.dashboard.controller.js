const User = require("../models/User");
const Appointment = require("../models/Appointment");
const NhisOfficial = require("../models/NhisOfficial");
const asyncHandler = require("../utils/asyncHandler");
const { APPOINTMENT_STATUS } = require("../config/constants");

const getDashboardStats = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  // Get all stats in parallel
  const [
    totalUsers,
    verifiedUsers,
    newUsersThisMonth,
    totalAppointments,
    confirmedAppointments,
    todayAppointments,
    upcomingAppointments,
    totalOfficials,
    activeOfficials,
    recentUsers,
    recentAppointments,
    appointmentsByStatus,
    userGrowth,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isVerified: true }),
    User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    Appointment.countDocuments(),
    Appointment.countDocuments({ status: APPOINTMENT_STATUS.CONFIRMED }),
    Appointment.countDocuments({ 
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    }),
    Appointment.countDocuments({ 
      date: { $gte: today },
      status: { $ne: APPOINTMENT_STATUS.CANCELLED }
    }),
    NhisOfficial.countDocuments(),
    NhisOfficial.countDocuments({ isActive: true }),
    User.find()
      .select("fullName email nhisNumber createdAt isVerified")
      .sort({ createdAt: -1 })
      .limit(5),
    Appointment.find()
      .populate("userId", "fullName email nhisNumber")
      .sort({ createdAt: -1 })
      .limit(5),
    Appointment.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    User.aggregate([
      {
        $match: { createdAt: { $gte: sevenDaysAgo } }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]),
  ]);
  
  res.status(200).json({
    success: true,
    stats: {
      users: {
        total: totalUsers,
        verified: verifiedUsers,
        newThisMonth: newUsersThisMonth,
      },
      appointments: {
        total: totalAppointments,
        confirmed: confirmedAppointments,
        today: todayAppointments,
        upcoming: upcomingAppointments,
        byStatus: appointmentsByStatus,
      },
      officials: {
        total: totalOfficials,
        active: activeOfficials,
      },
      recent: {
        users: recentUsers,
        appointments: recentAppointments,
      },
      growth: {
        users: userGrowth,
      },
    },
  });
});

module.exports = {
  getDashboardStats,
};
