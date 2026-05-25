const Appointment = require("../models/Appointment");
const BookingSlotCapacity = require("../models/BookingSlotCapacity");
const ApiError = require("../utils/ApiError");
const {
  SLOT_PERIODS,
  SLOT_PERIOD_IDS,
  DEFAULT_MAX_SLOTS_PER_PERIOD,
  APPOINTMENT_STATUS,
} = require("../config/constants");
const { normalizeDateOnly } = require("../utils/date");

async function countBookedForPeriod(normalizedDate, period, centreId) {
  const query = {
    date: normalizedDate,
    timeSlot: period,
    status: { $ne: APPOINTMENT_STATUS.CANCELLED },
  };
  if (centreId) {
    query.centreId = centreId;
  }
  return Appointment.countDocuments(query);
}

async function getMaxSlotsForPeriod(normalizedDate, period) {
  const record = await BookingSlotCapacity.findOne({ date: normalizedDate, period });
  return record ? record.maxSlots : DEFAULT_MAX_SLOTS_PER_PERIOD;
}

async function getAvailabilityForDate(normalizedDate, centreId) {
  const periods = await Promise.all(
    SLOT_PERIOD_IDS.map(async (period) => {
      const maxSlots = await getMaxSlotsForPeriod(normalizedDate, period);
      const booked = await countBookedForPeriod(normalizedDate, period, centreId);
      const remaining = Math.max(0, maxSlots - booked);
      const meta = SLOT_PERIODS[period];
      return {
        id: period,
        label: meta.label,
        hours: meta.hours,
        maxSlots,
        booked,
        remaining,
        available: remaining > 0,
      };
    }),
  );

  return periods;
}

async function getCapacityForDate(dateInput) {
  const normalizedDate = normalizeDateOnly(dateInput);
  if (!normalizedDate) {
    throw new ApiError(400, "Invalid date");
  }

  const records = await BookingSlotCapacity.find({ date: normalizedDate });
  const bookedByPeriod = {};
  for (const period of SLOT_PERIOD_IDS) {
    bookedByPeriod[period] = await countBookedForPeriod(normalizedDate, period);
  }

  return SLOT_PERIOD_IDS.map((period) => {
    const record = records.find((r) => r.period === period);
    const maxSlots = record ? record.maxSlots : DEFAULT_MAX_SLOTS_PER_PERIOD;
    return {
      period,
      label: SLOT_PERIODS[period].label,
      hours: SLOT_PERIODS[period].hours,
      maxSlots,
      booked: bookedByPeriod[period],
      remaining: Math.max(0, maxSlots - bookedByPeriod[period]),
    };
  });
}

async function setCapacityForDate(dateInput, capacities) {
  const normalizedDate = normalizeDateOnly(dateInput);
  if (!normalizedDate) {
    throw new ApiError(400, "Invalid date");
  }

  if (!Array.isArray(capacities) || capacities.length === 0) {
    throw new ApiError(400, "capacities array is required");
  }

  const results = [];
  for (const item of capacities) {
    if (!SLOT_PERIOD_IDS.includes(item.period)) {
      throw new ApiError(400, `Invalid period: ${item.period}`);
    }
    const maxSlots = Number(item.maxSlots);
    if (Number.isNaN(maxSlots) || maxSlots < 0) {
      throw new ApiError(400, "maxSlots must be a non-negative number");
    }

    const booked = await countBookedForPeriod(normalizedDate, item.period);
    if (maxSlots < booked) {
      throw new ApiError(
        400,
        `Cannot set ${item.period} below ${booked} (already booked slots)`,
      );
    }

    const record = await BookingSlotCapacity.findOneAndUpdate(
      { date: normalizedDate, period: item.period },
      { date: normalizedDate, period: item.period, maxSlots },
      { upsert: true, new: true, runValidators: true },
    );
    results.push(record);
  }

  return getCapacityForDate(normalizedDate);
}

module.exports = {
  getAvailabilityForDate,
  getCapacityForDate,
  setCapacityForDate,
  countBookedForPeriod,
  getMaxSlotsForPeriod,
};
