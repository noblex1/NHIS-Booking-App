const mongoose = require("mongoose");
const { APPOINTMENT_STATUS, NHIS_SERVICE_TYPES } = require("../config/constants");
const { APPLICATION_STATUS } = require("../config/nhisApplication");

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    centreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceCentre",
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
    applicationStatus: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      default: APPLICATION_STATUS.SUBMITTED,
      index: true,
    },
    referenceNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      index: true,
    },
    feeAmount: {
      type: Number,
      default: 0,
    },
    feePaid: {
      type: Boolean,
      default: false,
    },
    feePaymentReference: {
      type: String,
      trim: true,
      default: "",
    },
    documentsAcknowledged: {
      type: [String],
      default: [],
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

module.exports = mongoose.model("Appointment", appointmentSchema);
