const express = require("express");
const router = express.Router();
const ConcurrentAcc = require("../controller/accessoire/index");
const ConcurrentApp = require("../controller/appareillage/index");
const ConcurrentDisj = require("../controller/disjoncteur/index");
const ConcurrentLamp = require("../controller/lampe/index");
const authMiddleware = require("../../../middleware/Auth");
const authorize = require("../../../middleware/authorize");
// --- create routes ---

router.post(
  "/accessoire",
  authMiddleware,
  authorize("admin", "responsable"),
  ConcurrentAcc.CreateConcurrentAcc,
);
router.post(
  "/appareillage",
  authMiddleware,
  authorize("admin", "responsable"),
  ConcurrentApp.createConcurrentAppareillage,
);
router.post(
  "/disjoncteur",
  authMiddleware,
  authorize("admin", "responsable"),
  ConcurrentDisj.createConcurrentDisjoncteur,
);
router.post(
  "/lampe",
  authMiddleware,
  authorize("admin", "responsable"),
  ConcurrentLamp.createConcurrentLampe,
);

// --- GET ALL routes ---
router.get(
  "/accessoire",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  ConcurrentAcc.getAllConcurrentAccessoire,
);
router.get(
  "/appareillage",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  ConcurrentApp.getAllConcurrentAppareillage,
);
router.get(
  "/disjoncteur",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  ConcurrentDisj.getAllConcurrentDisjoncteur,
);
router.get(
  "/lampe",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  ConcurrentLamp.getAllConcurrentLampe,
);

// --- GET BY ID routes ---
router.get(
  "/accessoire/:id",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  ConcurrentAcc.getConcurrentAccessoireById,
);
router.get(
  "/appareillage/:id",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  ConcurrentApp.getConcurrentAppareillageById,
);
router.get(
  "/disjoncteur/:id",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  ConcurrentDisj.getConcurrentDisjoncteurById,
);
router.get(
  "/lampe/:id",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  ConcurrentLamp.getConcurrentLampeById,
);

// --- UPDATE routes ---
router.put(
  "/accessoire/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  ConcurrentAcc.updateConcurrent,
);
router.put(
  "/appareillage/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  ConcurrentApp.updateConcurrentAppareillage,
);
router.put(
  "/disjoncteur/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  ConcurrentDisj.updateConcurrentDisjoncteur,
);
router.put(
  "/lampe/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  ConcurrentLamp.updateConcurrentLampe,
);

// --- DELETE routes ---
router.delete(
  "/accessoire/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  ConcurrentAcc.deleteConcurrentAccessoire,
);
router.delete(
  "/appareillage/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  ConcurrentApp.deleteConcurrentAppareillage,
);
router.delete(
  "/disjoncteur/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  ConcurrentDisj.deleteConcurrentDisjoncteur,
);
router.delete(
  "/lampe/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  ConcurrentLamp.deleteConcurrentLampe,
);

module.exports = router;
