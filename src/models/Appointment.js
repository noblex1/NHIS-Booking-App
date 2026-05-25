const mongoose = require("mongoose");
const { APPOINTMENT_STATUS, NHIS_SERVICE_TYPES } = require("../config/constants");

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    timeSlot: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    serviceType: {
      type: String,
      enum: Object.values(NHIS_SERVICE_TYPES),
      default: NHIS_SERVICE_TYPES.RENEWAL,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(APPOINTMENT_STATUS),
      default: APPOINTMENT_STATUS.CONFIRMED,
      index: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

appointmentSchema.index(
  { date: 1, timeSlot: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $ne: APPOINTMENT_STATUS.CANCELLED },
    },
  },
);

module.exports = mongoose.model("Appointment", appointmentSchema);
