const express = require("express");
const router = express.Router();
//const { authMiddleware, authorize } = require("../../../middleware");
const CadeauController = require("../controller/index");
const authMiddleware = require("../../../middleware/Auth");

router.get("/all", authMiddleware, CadeauController.GetAllCadeau);
router.get("/:id", authMiddleware, CadeauController.GetCadeauById);
router.post("/", authMiddleware, CadeauController.createCadeau);
router.put("/:id", authMiddleware, CadeauController.UpdateCadeau);
router.delete("/:id", authMiddleware, CadeauController.deleteCadeau);

module.exports = router;
