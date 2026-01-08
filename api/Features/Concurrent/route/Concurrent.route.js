const express = require("express");
const router = express.Router();
const ConcurrentAcc = require("../controller/accessoire/index");
const ConcurrentApp = require("../controller/appareillage/index");
const ConcurrentDisj = require("../controller/disjoncteur/index");
const ConcurrentLamp = require("../controller/lampe/index");
const authMiddleware = require("../../../middleware/Auth");

// --- create routes ---

router.post("/accessoire", authMiddleware, ConcurrentAcc.CreateConcurrentAcc);
router.post(
  "/appareillage",
  authMiddleware,
  ConcurrentApp.createConcurrentAppareillage
);
router.post(
  "/disjoncteur",
  authMiddleware,
  ConcurrentDisj.createConcurrentDisjoncteur
);
router.post("/lampe", authMiddleware, ConcurrentLamp.createConcurrentLampe);

// --- GET ALL routes ---
router.get(
  "/accessoire",
  authMiddleware,
  ConcurrentAcc.getAllConcurrentAccessoire
);
router.get(
  "/appareillage",
  authMiddleware,
  ConcurrentApp.getAllConcurrentAppareillage
);
router.get(
  "/disjoncteur",
  authMiddleware,
  ConcurrentDisj.getAllConcurrentDisjoncteur
);
router.get("/lampe", authMiddleware, ConcurrentLamp.getAllConcurrentLampe);

// --- GET BY ID routes ---
router.get(
  "/accessoire/:id",
  authMiddleware,
  ConcurrentAcc.getConcurrentAccessoireById
);
router.get(
  "/appareillage/:id",
  authMiddleware,
  ConcurrentApp.getConcurrentAppareillageById
);
router.get(
  "/disjoncteur/:id",
  authMiddleware,
  ConcurrentDisj.getConcurrentDisjoncteurById
);
router.get("/lampe/:id", authMiddleware, ConcurrentLamp.getConcurrentLampeById);

// --- UPDATE routes ---
router.put("/accessoire/:id", authMiddleware, ConcurrentAcc.updateConcurrent);
router.put(
  "/appareillage/:id",
  authMiddleware,
  ConcurrentApp.updateConcurrentAppareillage
);
router.put(
  "/disjoncteur/:id",
  authMiddleware,
  ConcurrentDisj.updateConcurrentDisjoncteur
);
router.put("/lampe/:id", authMiddleware, ConcurrentLamp.updateConcurrentLampe);

// --- DELETE routes ---
router.delete(
  "/accessoire/:id",
  authMiddleware,
  ConcurrentAcc.deleteConcurrentAccessoire
);
router.delete(
  "/appareillage/:id",
  authMiddleware,
  ConcurrentApp.deleteConcurrentAppareillage
);
router.delete(
  "/disjoncteur/:id",
  authMiddleware,
  ConcurrentDisj.deleteConcurrentDisjoncteur
);
router.delete(
  "/lampe/:id",
  authMiddleware,
  ConcurrentLamp.deleteConcurrentLampe
);

module.exports = router;
