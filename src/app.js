const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const appointmentRoutes = require("./routes/appointment.routes");
const errorHandler = require("./middlewares/error.middleware");
const notFoundHandler = require("./middlewares/notFound.middleware");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(
  morgan("combined", {
    skip: () => process.env.NODE_ENV === "test",
  }),
);

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "NHIS Appointment Booking API is healthy",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
