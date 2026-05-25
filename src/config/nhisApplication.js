const { NHIS_SERVICE_TYPES } = require("./constants");

const APPLICATION_STATUS = {
  SUBMITTED: "submitted",
  AT_CENTRE: "at_centre",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

const APPLICATION_STATUS_LABELS = {
  submitted: "Submitted online",
  at_centre: "At service centre",
  completed: "Completed",
  cancelled: "Cancelled",
};

/** GHS amounts — adjust per NHIA policy */
const SERVICE_FEES = {
  [NHIS_SERVICE_TYPES.NEW_REGISTRATION]: 0,
  [NHIS_SERVICE_TYPES.RENEWAL]: 0,
};

const DOCUMENT_REQUIREMENTS = {
  [NHIS_SERVICE_TYPES.NEW_REGISTRATION]: [
    {
      id: "ghana_card",
      label: "Valid Ghana Card (original)",
      required: true,
    },
    {
      id: "birth_cert",
      label: "Birth certificate or age declaration (if applicable)",
      required: false,
    },
    {
      id: "passport_photo",
      label: "Two recent passport-sized photographs",
      required: true,
    },
    {
      id: "residence_proof",
      label: "Proof of residence (utility bill or tenancy)",
      required: true,
    },
  ],
  [NHIS_SERVICE_TYPES.RENEWAL]: [
    {
      id: "ghana_card",
      label: "Valid Ghana Card (original)",
      required: true,
    },
    {
      id: "nhis_card",
      label: "Existing NHIS card or membership details",
      required: true,
    },
    {
      id: "passport_photo",
      label: "One recent passport-sized photograph",
      required: false,
    },
  ],
};

module.exports = {
  APPLICATION_STATUS,
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_VALUES: Object.values(APPLICATION_STATUS),
  SERVICE_FEES,
  DOCUMENT_REQUIREMENTS,
};
