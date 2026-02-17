const express = require("express");
const router = express.Router();
const CadeauController = require("../controller/index");
const authMiddleware = require("../../../middleware/Auth");
const authorize = require("../../../middleware/authorize");
router.get(
  "/all",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  CadeauController.GetAllCadeau,
);
router.get(
  "/:id",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  CadeauController.GetCadeauById,
);
router.post(
  "/",
  authMiddleware,
  authorize("admin", "responsable"),
  CadeauController.createCadeau,
);
router.put(
  "/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  CadeauController.UpdateCadeau,
);
router.delete(
  "/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  CadeauController.deleteCadeau,
);

module.exports = router;
