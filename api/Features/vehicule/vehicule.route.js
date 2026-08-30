const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/Auth");
const authorize = require("../../middleware/Authorize");

const VehiculeController = require("./controller/index");

router.get(
  "/all",
  authMiddleware,
  authorize("admin", "responsable"),
  VehiculeController.getAllVehicule,
);
router.get(
  "/:id",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  VehiculeController.getVehiculeById,
);
router.post(
  "/",
  authMiddleware,
  authorize("admin", "responsable"),
  VehiculeController.addV,
);
router.put(
  "/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  VehiculeController.updateV,
);
router.delete(
  "/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  VehiculeController.deleteV,
);

module.exports = router;
