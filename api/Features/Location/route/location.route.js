const express = require("express");
const router = express.Router();
const authMiddleware = require("../../../middleware/Auth");
const authorize = require("../../../middleware/authorize");

const LocationController = require("../controller/getLocation.controller");

router.get(
  "/",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  LocationController.GetAllLocation,
);
router.get(
  "/ville",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  LocationController.GetLocationForForm,
);
router.get(
  "/wilayas",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  LocationController.GetJustWilayas,
);

router.get(
  "/:id",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  LocationController.GetLocationById,
);
module.exports = router;
