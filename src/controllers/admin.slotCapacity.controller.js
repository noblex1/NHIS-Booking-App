const asyncHandler = require("../utils/asyncHandler");
const { getCapacityForDate, setCapacityForDate } = require("../services/slotCapacity.service");
const { SLOT_PERIODS } = require("../config/constants");

const getSlotCapacity = asyncHandler(async (req, res) => {
  const { date } = req.query;
  const capacities = await getCapacityForDate(date);

  res.status(200).json({
    success: true,
    date,
    capacities,
    periodMeta: SLOT_PERIODS,
  });
});

const updateSlotCapacity = asyncHandler(async (req, res) => {
  const { date, capacities } = req.body;
  const updated = await setCapacityForDate(date, capacities);

  res.status(200).json({
    success: true,
    message: "Slot capacity updated",
    date,
    capacities: updated,
  });
});

module.exports = {
  getSlotCapacity,
  updateSlotCapacity,
};
