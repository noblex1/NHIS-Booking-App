const mongoose = require("mongoose");

const serviceCentreSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true, unique: true, uppercase: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    region: { type: String, required: true, trim: true },
    phone: { type: String, trim: true, default: "" },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ServiceCentre", serviceCentreSchema);
