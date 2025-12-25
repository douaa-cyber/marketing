const express = require("express");
const router = express.Router();

const LocationController = require("../controller/getLocation.controller");

router.get("/", LocationController.GetAllLocation);
router.get("/ville", LocationController.GetLocationForForm);
router.get("/:id", LocationController.GetLocationById);

module.exports = router;
