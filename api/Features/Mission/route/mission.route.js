const express = require("express");
const router = express.Router();
//const { authMiddleware, authorize } = require("../../../middleware");
const MissionController = require("../controller/index");
const authMiddleware = require("../../../middleware/Auth");
const authorize = require("../../../middleware/authorize");

router.get(
  "/all",

  MissionController.getAllMissions,
);
router.get(
  "/:id",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  MissionController.getMissionById,
);
router.post(
  "/",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  MissionController.addM,
);
router.put(
  "/:id",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  MissionController.updateM,
);
router.delete(
  "/:id",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  MissionController.deleteM,
);

module.exports = router;
