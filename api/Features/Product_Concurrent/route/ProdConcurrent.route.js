const express = require("express");
const router = express.Router();

const AccController = require("../controller/accessoire/index");

const authMiddleware = require("../../../middleware/Auth");
const authorize = require("../../../middleware/Authorize");

// --- ROUTES ACCESSOIRE ---
router.get(
  "/",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  AccController.getAllProdConcu,
);
router.get(
  "/:id",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  AccController.getProdConcuById,
);
router.post(
  "/",
  authMiddleware,
  authorize("admin", "responsable"),
  AccController.createProduitConcu,
);
router.put(
  "/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  AccController.updateProdConcu,
);
router.delete(
  "/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  AccController.deleteProdConcu,
);

//

module.exports = router;
