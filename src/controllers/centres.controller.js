const asyncHandler = require("../utils/asyncHandler");
const { getDefaultCentre } = require("../services/centre.service");
const {
  DOCUMENT_REQUIREMENTS,
  SERVICE_FEES,
  APPLICATION_STATUS_LABELS,
} = require("../config/nhisApplication");

const listActiveCentres = asyncHandler(async (_req, res) => {
  const centre = await getDefaultCentre();

  res.status(200).json({
    success: true,
    centres: [centre],
    defaultCentre: centre,
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
