const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");

async function requireAuth(req, _res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return next(new ApiError(401, "Authorization token is required"));

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).select("-__v");
    if (!user || !user.isVerified) {
      return next(new ApiError(401, "Invalid or expired token"));
    }
    req.user = user;
    return next();
  } catch (_error) {
    return next(new ApiError(401, "Invalid or expired token"));
  }
}

module.exports = {
  requireAuth,
};
