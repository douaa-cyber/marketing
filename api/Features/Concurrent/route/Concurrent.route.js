const express = require("express");
const router = express.Router();
const Concurrent = require("../controller/accessoire/index");

const authMiddleware = require("../../../middleware/Auth");
const authorize = require("../../../middleware/authorize");
// --- create routes ---

router.post(
  "/",
  authMiddleware,
  authorize("admin", "responsable"),
  Concurrent.CreateConcurrent,
);

// --- GET ALL routes ---
router.get(
  "/",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  Concurrent.getAllConcurrent,
);

// --- GET BY ID routes ---
router.get(
  "/:id",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  Concurrent.getConcurrentById,
);

// --- UPDATE routes ---
router.put(
  "/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  Concurrent.updateConcurrent,
);

// --- DELETE routes ---
router.delete(
  "/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  Concurrent.deleteConcurrent,
);

module.exports = router;
