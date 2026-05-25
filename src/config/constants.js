const DEFAULT_TIME_SLOTS = [
  "08:30 AM",
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
];

const APPOINTMENT_STATUS = {
  CONFIRMED: "Confirmed",
  PENDING: "Pending",
  CANCELLED: "Cancelled",
};

/** In-person NHIA centre services (passport-style application types) */
const NHIS_SERVICE_TYPES = {
  NEW_REGISTRATION: "new_registration",
  RENEWAL: "renewal",
};

const NHIS_SERVICE_TYPE_VALUES = Object.values(NHIS_SERVICE_TYPES);

module.exports = {
  DEFAULT_TIME_SLOTS,
  APPOINTMENT_STATUS,
  NHIS_SERVICE_TYPES,
  NHIS_SERVICE_TYPE_VALUES,
};
