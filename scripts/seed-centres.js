/**
 * Seed Techiman Municipal as the sole NHIA service centre.
 * Usage: node scripts/seed-centres.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const ServiceCentre = require("../src/models/ServiceCentre");
const { DEFAULT_CENTRE } = require("../src/config/constants");

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI missing");
    process.exit(1);
  }

  await mongoose.connect(uri);

  await ServiceCentre.deleteMany({ code: { $ne: DEFAULT_CENTRE.code } });

  const centre = await ServiceCentre.findOneAndUpdate(
    { code: DEFAULT_CENTRE.code },
    { ...DEFAULT_CENTRE, isActive: true },
    { upsert: true, new: true },
  );

  console.log(`✓ ${centre.name} (${centre.code})`);

  await mongoose.disconnect();
  console.log("\nDone.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
