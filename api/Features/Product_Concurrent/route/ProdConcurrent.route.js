const express = require("express");
const router = express.Router();

const AccController = require("../controller/accessoire/index");
const AppController = require("../controller/appareillage/index");
const DisjController = require("../controller/disjoncteur/index");
const LampController = require("../controller/lampe/index");
const authMiddleware = require("../../../middleware/Auth");

// --- ROUTES ACCESSOIRE ---
router.get(
  "/accessoire",
  authMiddleware,
  AccController.getAllProdConcurrentAccessoire
);
router.get(
  "/accessoire/:id",
  authMiddleware,
  AccController.getProdConcurrentAccessoireById
);
router.post(
  "/accessoire",
  authMiddleware,
  AccController.createProdConcurrentAccessoire
);
router.put("/accessoire/:id", authMiddleware, AccController.updateProdConcuAcc);
router.delete(
  "/accessoire/:id",
  authMiddleware,
  AccController.deleteProdConcuAcc
);

// --- ROUTES APPAREILLAGE ---
router.get(
  "/appareillage",
  authMiddleware,
  AppController.getAllProdConcurrentAppareillage
);
router.get(
  "/appareillage/:id",
  authMiddleware,
  AppController.getProdConcurrentAppareillageById
);
router.post("/appareillage", authMiddleware, AppController.addProdConcuApp);
router.put(
  "/appareillage/:id",
  authMiddleware,
  AppController.updateProdConcuApp
);
router.delete(
  "/appareillage/:id",
  authMiddleware,
  AppController.deleteProdConcuApp
);

// --- ROUTES DISJONCTEUR ---
router.get(
  "/disjoncteur",
  authMiddleware,
  DisjController.getAllProdConcurrentDisjoncteur
);
router.get(
  "/disjoncteur/:id",
  authMiddleware,
  DisjController.getProdConcurrentDisjoncteurById
);
router.post("/disjoncteur", authMiddleware, DisjController.addProdConcuDisj);
router.put(
  "/disjoncteur/:id",
  authMiddleware,
  DisjController.updateProdConcuDisj
);
router.delete(
  "/disjoncteur/:id",
  authMiddleware,
  DisjController.deleteProdConcuDisj
);

// --- ROUTES LAMPE ---
router.get("/lampe", authMiddleware, LampController.getAllProdConcurrentLampe);
router.get(
  "/lampe/:id",
  authMiddleware,
  LampController.getProdConcurrentLampeById
);
router.post("/lampe", authMiddleware, LampController.addProdConcuLamp);
router.put("/lampe/:id", authMiddleware, LampController.updateProdConcuLamp);
router.delete("/lampe/:id", authMiddleware, LampController.deleteProdConcuLamp);

module.exports = router;
