const express = require("express");
const router = express.Router();
const ActiviteController = require("../controller/index");
const authMiddleware = require("../../../middleware/Auth");
const authorize = require("../../../middleware/Authorize");
router.get(
  "/all",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  ActiviteController.GetAllActivite,
);
router.get(
  "/:id",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  ActiviteController.GetActiviteById,
);
router.post(
  "/",
  authMiddleware,
  authorize("admin", "responsable"),
  ActiviteController.createActivite,
);
router.put(
  "/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  ActiviteController.UpdateActivite,
);
router.delete(
  "/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  ActiviteController.deleteActivite,
);

module.exports = router;
