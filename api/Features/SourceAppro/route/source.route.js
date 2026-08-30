const express = require("express");
const router = express.Router();
const authMiddleware = require("../../../middleware/Auth");
const authorize = require("../../../middleware/Authorize");

const SourceController = require("../controller/index");

router.get(
  "/all",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  SourceController.getAllSourceAppro,
);
router.get(
  "/:id",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  SourceController.getSourceApproById,
);
router.post(
  "/",
  authMiddleware,
  authorize("admin", "responsable"),
  SourceController.addS,
);
router.put(
  "/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  SourceController.updateS,
);
router.delete(
  "/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  SourceController.deleteS,
);

module.exports = router;
