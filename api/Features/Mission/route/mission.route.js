const express = require("express");
const router = express.Router();
//const { authMiddleware, authorize } = require("../../../middleware");
const MissionController = require("../controller/index");
const authMiddleware = require("../../../middleware/Auth");

router.get("/all", authMiddleware, MissionController.getAllMissions);
router.get("/:id", authMiddleware, MissionController.getMissionById);
router.post("/", authMiddleware, MissionController.addM);
router.put("/:id", authMiddleware, MissionController.updateM);
router.delete("/:id", authMiddleware, MissionController.deleteM);

module.exports = router;
