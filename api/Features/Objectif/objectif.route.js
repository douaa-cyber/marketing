const express = require("express");
const router = express.Router();
const ObjectifController = require("./objectif.controller");
const authMiddleware = require("../../middleware/Auth");
const authorize = require("../../middleware/authorize");
router.get(
  "/all",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  ObjectifController.GetAllObjectif,
);
router.get(
  "/:id",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  ObjectifController.GetObjectifById,
);
router.post(
  "/",
  authMiddleware,
  authorize("admin", "responsable"),
  ObjectifController.createObjectif,
);
router.put(
  "/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  ObjectifController.UpdateObjectif,
);
router.delete(
  "/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  ObjectifController.deleteObjectif,
);

module.exports = router;
