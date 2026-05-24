const mongoose = require("mongoose");

const nhisOfficialSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

// Don't return __v in JSON responses
nhisOfficialSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model("NhisOfficial", nhisOfficialSchema);
