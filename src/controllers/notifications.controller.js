const NotificationPreferences = require("../models/NotificationPreferences");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const getPreferences = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  let preferences = await NotificationPreferences.findOne({ userId });

  // Create default preferences if they don't exist
  if (!preferences) {
    preferences = await NotificationPreferences.create({
      userId,
      emailNotifications: true,
      appointmentReminders: true,
      statusUpdates: true,
      promotions: false,
    });
  }

  res.status(200).json({
    success: true,
    preferences,
  });
});

const updatePreferences = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { emailNotifications, appointmentReminders, statusUpdates, promotions } = req.body;

  let preferences = await NotificationPreferences.findOne({ userId });

  if (!preferences) {
    preferences = await NotificationPreferences.create({
      userId,
      emailNotifications,
      appointmentReminders,
      statusUpdates,
      promotions,
    });
  } else {
    preferences.emailNotifications = emailNotifications ?? preferences.emailNotifications;
    preferences.appointmentReminders = appointmentReminders ?? preferences.appointmentReminders;
    preferences.statusUpdates = statusUpdates ?? preferences.statusUpdates;
    preferences.promotions = promotions ?? preferences.promotions;
    await preferences.save();
  }

  res.status(200).json({
    success: true,
    message: "Notification preferences updated successfully",
    preferences,
  });
});

module.exports = {
  getPreferences,
  updatePreferences,
};
