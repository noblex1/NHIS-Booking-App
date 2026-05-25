const mongoose = require("mongoose");
const { SLOT_PERIOD_IDS } = require("../config/constants");

const bookingSlotCapacitySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      index: true,
    },
    period: {
      type: String,
      enum: SLOT_PERIOD_IDS,
      required: true,
    },
    maxSlots: {
      type: Number,
      required: true,
      min: 0,
      default: 10,
    },
  },
  { timestamps: true },
);

bookingSlotCapacitySchema.index({ date: 1, period: 1 }, { unique: true });

module.exports = mongoose.model("BookingSlotCapacity", bookingSlotCapacitySchema);
