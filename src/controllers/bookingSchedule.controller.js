const asyncHandler = require("../utils/asyncHandler");
const { getScheduleInRange } = require("../services/bookingSchedule.service");

const getPublicSchedule = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const schedule = await getScheduleInRange(from, to);

  res.status(200).json({
    success: true,
    ...schedule,
  });
});

module.exports = {
  getPublicSchedule,
};
