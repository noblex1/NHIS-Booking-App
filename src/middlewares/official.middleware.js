const jwt = require("jsonwebtoken");
const NhisOfficial = require("../models/NhisOfficial");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const officialAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Official authentication required");
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type !== "official") {
      throw new ApiError(403, "Official access required");
    }

    const official = await NhisOfficial.findById(decoded.id)
      .select("-password")
      .populate("assignedCentreId", "name code address city region phone");

    if (!official) {
      throw new ApiError(401, "Official account not found");
    }

    if (!official.isActive) {
      throw new ApiError(403, "Official account is inactive");
    }

    req.official = official;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(401, "Invalid or expired official token");
  }
});

module.exports = {
  officialAuth,
};
