const APPOINTMENT_STATUS = {
  CONFIRMED: "Confirmed",
  PENDING: "Pending",
  CANCELLED: "Cancelled",
};

const NHIS_SERVICE_TYPES = {
  NEW_REGISTRATION: "new_registration",
  RENEWAL: "renewal",
};

const NHIS_SERVICE_TYPE_VALUES = Object.values(NHIS_SERVICE_TYPES);

/** Daily booking windows — Techiman Municipal centre */
const SLOT_PERIODS = {
  morning: {
    id: "morning",
    label: "Morning",
    hours: "8:00 AM – 11:00 AM",
  },
  afternoon: {
    id: "afternoon",
    label: "Afternoon",
    hours: "12:00 PM – 3:00 PM",
  },
  evening: {
    id: "evening",
    label: "Evening",
    hours: "4:00 PM – 6:00 PM",
  },
};

const SLOT_PERIOD_IDS = Object.keys(SLOT_PERIODS);

const DEFAULT_MAX_SLOTS_PER_PERIOD = Number(process.env.DEFAULT_MAX_SLOTS_PER_PERIOD) || 10;

const DEFAULT_CENTRE = {
  name: "Techiman Municipal NHIA Service Centre",
  code: "TECHIMAN",
  address: "NHIA Office, Techiman Municipal",
  city: "Techiman",
  region: "Bono East",
  phone: "",
};

module.exports = {
  APPOINTMENT_STATUS,
  NHIS_SERVICE_TYPES,
  NHIS_SERVICE_TYPE_VALUES,
  SLOT_PERIODS,
  SLOT_PERIOD_IDS,
  DEFAULT_MAX_SLOTS_PER_PERIOD,
  DEFAULT_CENTRE,
};
