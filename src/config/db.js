const mongoose = require("mongoose");
const logger = require("../utils/logger");

async function connectDB() {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    throw new Error("MONGODB_URI is not set");
  }

  await mongoose.connect(mongoURI);
  logger.info("MongoDB connected successfully");
}

module.exports = connectDB;
