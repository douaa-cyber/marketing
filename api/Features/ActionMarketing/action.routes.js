const express = require("express");
const router = express.Router();
const criteriaController = require("./action.controller");
const authenticate = require("../../middleware/Auth");
const authorize = require("../../middleware/authorize");
router.get(
  "/",
  authenticate,
  authorize("admin", "responsable", "marketeur"),
  criteriaController.getAllCriteria,
);

router.post(
  "/",
  authenticate,
  authorize("admin", "responsable", "marketeur"),
  criteriaController.createCriteria,
);

router.put(
  "/:id",
  authenticate,
  authorize("admin", "responsable", "marketeur"),
  criteriaController.updateCriteria,
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin", "responsable", "marketeur"),
  criteriaController.deleteCriteria,
);

module.exports = router;
