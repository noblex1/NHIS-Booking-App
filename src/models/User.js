const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    nhisNumber: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      index: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

module.exports = mongoose.model("User", userSchema);
