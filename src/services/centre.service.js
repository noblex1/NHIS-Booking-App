const ServiceCentre = require("../models/ServiceCentre");
const { DEFAULT_CENTRE } = require("../config/constants");

async function ensureDefaultCentre() {
  let centre = await ServiceCentre.findOne({ code: DEFAULT_CENTRE.code });
  if (!centre) {
    centre = await ServiceCentre.create({
      ...DEFAULT_CENTRE,
      isActive: true,
    });
  }
  return centre;
}

async function getDefaultCentre() {
  return ensureDefaultCentre();
}

module.exports = {
  ensureDefaultCentre,
  getDefaultCentre,
};
