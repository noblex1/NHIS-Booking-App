const logger = require("../utils/logger");

module.exports = function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  const details = err.details || null;

  if (statusCode >= 500) {
    logger.error("Unhandled server error", { message, stack: err.stack });
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
  });
};
