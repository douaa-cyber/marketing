const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/Auth");

const VehiculeController = require("./controller/index");

router.get("/all", authMiddleware, VehiculeController.getAllVehicule);
router.get("/:id", authMiddleware, VehiculeController.getVehiculeById);
router.post("/", authMiddleware, VehiculeController.addV);
router.put("/:id", authMiddleware, VehiculeController.updateV);
router.delete("/:id", authMiddleware, VehiculeController.deleteV);

module.exports = router;
