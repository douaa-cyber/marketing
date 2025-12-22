const express = require("express");
const router = express.Router();
const { authMiddleware, authorize } = require("../../../middleware");
const CadeauController = require("../controller/index");

router.get("/all", CadeauController.GetAllCadeau);
router.get("/:id", CadeauController.GetCadeauById);
router.post("/", CadeauController.createCadeau);
router.put("/:id", CadeauController.updateCadeau);
router.delete("/:id", CadeauController.deleteCadeau);

module.exports = router;
