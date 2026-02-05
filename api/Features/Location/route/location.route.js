const express = require("express");
const router = express.Router();
const authMiddleware = require("../../../middleware/Auth");

const LocationController = require("../controller/getLocation.controller");

router.get("/", authMiddleware, LocationController.GetAllLocation);
router.get("/ville", authMiddleware, LocationController.GetLocationForForm);
router.get("/wilayas", LocationController.GetJustWilayas);

router.get("/:id", authMiddleware, LocationController.GetLocationById);
module.exports = router;
