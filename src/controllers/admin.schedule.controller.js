const asyncHandler = require("../utils/asyncHandler");
const {
  getScheduleInRange,
  upsertDateRule,
  removeDateRule,
} = require("../services/bookingSchedule.service");

const getSchedule = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const schedule = await getScheduleInRange(from, to);

  res.status(200).json({
    success: true,
    ...schedule,
  });
});

const setScheduleRule = asyncHandler(async (req, res) => {
  const { date, type, reason } = req.body;
  const rule = await upsertDateRule(date, type, reason);

  res.status(200).json({
    success: true,
    message: "Schedule updated",
    rule,
  });
});

const deleteScheduleRule = asyncHandler(async (req, res) => {
  const { date } = req.params;
  const result = await removeDateRule(date);

  res.status(200).json({
    success: true,
    message: "Schedule rule removed",
    ...result,
  });
});

module.exports = {
  getSchedule,
  setScheduleRule,
  deleteScheduleRule,
};
