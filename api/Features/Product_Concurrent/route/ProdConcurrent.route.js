const express = require("express");
const router = express.Router();

const AccController = require("../controller/accessoire/index");
const AppController = require("../controller/appareillage/index");
const DisjController = require("../controller/disjoncteur/index");
const LampController = require("../controller/lampe/index");
const authMiddleware = require("../../../middleware/Auth");
const authorize = require("../../../middleware/Authorize");

// --- ROUTES ACCESSOIRE ---
router.get(
  "/accessoire",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  AccController.getAllProdConcurrentAccessoire,
);
router.get(
  "/accessoire/:id",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  AccController.getProdConcurrentAccessoireById,
);
router.post(
  "/accessoire",
  authMiddleware,
  authorize("admin", "responsable"),
  AccController.createProdConcurrentAccessoire,
);
router.put(
  "/accessoire/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  AccController.updateProdConcuAcc,
);
router.delete(
  "/accessoire/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  AccController.deleteProdConcuAcc,
);

// --- ROUTES APPAREILLAGE ---
router.get(
  "/appareillage",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  AppController.getAllProdConcurrentAppareillage,
);
router.get(
  "/appareillage/:id",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  AppController.getProdConcurrentAppareillageById,
);
router.post(
  "/appareillage",
  authMiddleware,
  authorize("admin", "responsable"),
  AppController.addProdConcuApp,
);
router.put(
  "/appareillage/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  AppController.updateProdConcuApp,
);
router.delete(
  "/appareillage/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  AppController.deleteProdConcuApp,
);

// --- ROUTES DISJONCTEUR ---
router.get(
  "/disjoncteur",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  DisjController.getAllProdConcurrentDisjoncteur,
);
router.get(
  "/disjoncteur/:id",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  DisjController.getProdConcurrentDisjoncteurById,
);
router.post(
  "/disjoncteur",
  authMiddleware,
  authorize("admin", "responsable"),
  DisjController.addProdConcuDisj,
);
router.put(
  "/disjoncteur/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  DisjController.updateProdConcuDisj,
);
router.delete(
  "/disjoncteur/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  DisjController.deleteProdConcuDisj,
);

// --- ROUTES LAMPE ---
router.get(
  "/lampe",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  LampController.getAllProdConcurrentLampe,
);
router.get(
  "/lampe/:id",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  LampController.getProdConcurrentLampeById,
);
router.post(
  "/lampe",
  authMiddleware,
  authorize("admin", "responsable"),
  LampController.addProdConcuLamp,
);
router.put(
  "/lampe/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  LampController.updateProdConcuLamp,
);
router.delete(
  "/lampe/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  LampController.deleteProdConcuLamp,
);

module.exports = router;
