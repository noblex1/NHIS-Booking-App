const Appointment = require("../models/Appointment");

async function generateUniqueReferenceNumber() {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
    const referenceNumber = `NHIS-${datePart}-${randomPart}`;
    const exists = await Appointment.exists({ referenceNumber });
    if (!exists) {
      return referenceNumber;
    }
  }
  throw new Error("Failed to generate unique reference number");
}

module.exports = {
  generateUniqueReferenceNumber,
};
