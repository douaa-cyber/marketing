const express = require("express");
const router = express.Router();
//const { authMiddleware, authorize } = require("../../../middleware");
const MissionController = require("../controller/index");

router.get("/all", MissionController.getAllMissions);
router.get("/:id", MissionController.getMissionById);
router.post("/", MissionController.addM);
router.put("/:id", MissionController.updateM);
router.delete("/:id", MissionController.deleteM);

module.exports = router;
