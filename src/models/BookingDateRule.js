const mongoose = require("mongoose");

const bookingDateRuleSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["blocked", "open"],
      required: true,
    },
    reason: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("BookingDateRule", bookingDateRuleSchema);
