const ServiceCentre = require("../models/ServiceCentre");
const asyncHandler = require("../utils/asyncHandler");
const {
  DOCUMENT_REQUIREMENTS,
  SERVICE_FEES,
  APPLICATION_STATUS_LABELS,
} = require("../config/nhisApplication");

const listActiveCentres = asyncHandler(async (_req, res) => {
  const centres = await ServiceCentre.find({ isActive: true }).sort({ region: 1, city: 1, name: 1 });

  res.status(200).json({
    success: true,
    centres,
  });
});

const getApplicationConfig = asyncHandler(async (_req, res) => {
  res.status(200).json({
    success: true,
    documentRequirements: DOCUMENT_REQUIREMENTS,
    serviceFees: SERVICE_FEES,
    applicationStatusLabels: APPLICATION_STATUS_LABELS,
  });
});

module.exports = {
  listActiveCentres,
  getApplicationConfig,
};
