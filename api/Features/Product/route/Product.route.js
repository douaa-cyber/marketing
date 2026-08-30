const express = require("express");
const router = express.Router();
const authMiddleware = require("../../../middleware/Auth");
const authorize = require("../../../middleware/Authorize");

// Import all product controllers
const ConcurrentAcc = require("../controller/produit Accessoire/index");

// ---------------------- ACCESSOIRE ----------------------
router.post(
  "/",
  authMiddleware,
  authorize("admin", "responsable"),
  ConcurrentAcc.addProdAcc,
);
router.get(
  "/",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  ConcurrentAcc.getAllProduit,
);
router.get(
  "/:id",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  ConcurrentAcc.getProduitById,
);
router.put(
  "/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  ConcurrentAcc.updateProdAcc,
);
router.delete(
  "/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  ConcurrentAcc.deleteProdAcc,
);

module.exports = router;
