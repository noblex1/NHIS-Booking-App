const express = require("express");
const {
  listActiveCentres,
  getApplicationConfig,
} = require("../controllers/centres.controller");

const router = express.Router();

router.get("/", listActiveCentres);
router.get("/application-config", getApplicationConfig);

module.exports = router;
