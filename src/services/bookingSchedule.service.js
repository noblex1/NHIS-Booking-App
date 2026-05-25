const BookingDateRule = require("../models/BookingDateRule");
const ApiError = require("../utils/ApiError");
const { normalizeDateOnly, isPastDate } = require("../utils/date");

function dateToKey(date) {
  return date.toISOString().slice(0, 10);
}

async function getRuleForDate(normalizedDate) {
  return BookingDateRule.findOne({ date: normalizedDate });
}

async function isDateBookable(normalizedDate) {
  if (!normalizedDate || isPastDate(normalizedDate)) {
    return false;
  }

  const rule = await getRuleForDate(normalizedDate);
  if (rule) {
    return rule.type === "open";
  }

  return normalizedDate.getUTCDay() !== 0;
}

async function getScheduleInRange(fromInput, toInput) {
  const from = normalizeDateOnly(fromInput);
  const to = normalizeDateOnly(toInput);

  if (!from || !to) {
    throw new ApiError(400, "Invalid date range");
  }

  if (from > to) {
    throw new ApiError(400, "from date must be before to date");
  }

  const rules = await BookingDateRule.find({
    date: { $gte: from, $lte: to },
  }).sort({ date: 1 });

  const blockedDates = [];
  const openDates = [];

  for (const rule of rules) {
    const key = dateToKey(rule.date);
    if (rule.type === "blocked") {
      blockedDates.push(key);
    } else {
      openDates.push(key);
    }
  }

  return {
    rules: rules.map((rule) => ({
      date: dateToKey(rule.date),
      type: rule.type,
      reason: rule.reason,
    })),
    blockedDates,
    openDates,
  };
}

async function upsertDateRule(dateInput, type, reason = "") {
  const normalizedDate = normalizeDateOnly(dateInput);
  if (!normalizedDate) {
    throw new ApiError(400, "Invalid date");
  }

  if (!["blocked", "open"].includes(type)) {
    throw new ApiError(400, "type must be blocked or open");
  }

  const rule = await BookingDateRule.findOneAndUpdate(
    { date: normalizedDate },
    { date: normalizedDate, type, reason: reason.trim() },
    { new: true, upsert: true, runValidators: true },
  );

  return {
    date: dateToKey(rule.date),
    type: rule.type,
    reason: rule.reason,
  };
}

async function removeDateRule(dateInput) {
  const normalizedDate = normalizeDateOnly(dateInput);
  if (!normalizedDate) {
    throw new ApiError(400, "Invalid date");
  }

  const deleted = await BookingDateRule.findOneAndDelete({ date: normalizedDate });
  if (!deleted) {
    throw new ApiError(404, "No schedule rule for this date");
  }

  return { date: dateToKey(deleted.date) };
}

module.exports = {
  dateToKey,
  isDateBookable,
  getScheduleInRange,
  upsertDateRule,
  removeDateRule,
};
