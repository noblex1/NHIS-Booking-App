const ServiceCentre = require("../models/ServiceCentre");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const getAllCentres = asyncHandler(async (req, res) => {
  const { status = "all" } = req.query;
  const query = {};
  if (status === "active") query.isActive = true;
  if (status === "inactive") query.isActive = false;

  const centres = await ServiceCentre.find(query).sort({ region: 1, name: 1 });

  res.status(200).json({ success: true, centres });
});

const createCentre = asyncHandler(async (req, res) => {
  const centre = await ServiceCentre.create(req.body);
  res.status(201).json({ success: true, message: "Centre created", centre });
});

const updateCentre = asyncHandler(async (req, res) => {
  const centre = await ServiceCentre.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!centre) {
    throw new ApiError(404, "Centre not found");
  }
  res.status(200).json({ success: true, message: "Centre updated", centre });
});

const deleteCentre = asyncHandler(async (req, res) => {
  const centre = await ServiceCentre.findById(req.params.id);
  if (!centre) {
    throw new ApiError(404, "Centre not found");
  }
  await centre.deleteOne();
  res.status(200).json({ success: true, message: "Centre deleted" });
});

module.exports = {
  getAllCentres,
  createCentre,
  updateCentre,
  deleteCentre,
};
