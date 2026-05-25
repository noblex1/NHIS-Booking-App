/**
 * Seed default NHIA service centres.
 * Usage: node scripts/seed-centres.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const ServiceCentre = require("../src/models/ServiceCentre");

const centres = [
  {
    name: "NHIA Head Office — Accra",
    code: "ACC-HQ",
    address: "NHIA Head Office, Independence Avenue",
    city: "Accra",
    region: "Greater Accra",
    phone: "+233 302 123456",
    isActive: true,
  },
  {
    name: "Kumasi Regional NHIA Centre",
    code: "KUM-REG",
    address: "Regional NHIA Office, Harper Road",
    city: "Kumasi",
    region: "Ashanti",
    phone: "+233 322 445566",
    isActive: true,
  },
  {
    name: "Tamale NHIA Service Centre",
    code: "TAM-SVC",
    address: "NHIA Service Centre, Central Market Road",
    city: "Tamale",
    region: "Northern",
    phone: "+233 372 778899",
    isActive: true,
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI missing");
    process.exit(1);
  }

  await mongoose.connect(uri);

  for (const centre of centres) {
    await ServiceCentre.findOneAndUpdate({ code: centre.code }, centre, {
      upsert: true,
      new: true,
    });
    console.log(`✓ ${centre.name}`);
  }

  await mongoose.disconnect();
  console.log("\nDone seeding centres.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
