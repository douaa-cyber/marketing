const express = require("express");
const router = express.Router();
const authMiddleware = require("../../../middleware/Auth");
const authorize = require("../../../middleware/Authorize");

// Import all product controllers
const ConcurrentAcc = require("../controller/produit Accessoire/index");
const ConcurrentApp = require("../controller/produit Appareillage/index");
const ConcurrentDisj = require("../controller/produit Disjoncteur/index");
const ConcurrentLamp = require("../controller/produit Lampe/index");

// ---------------------- ACCESSOIRE ----------------------
router.post(
  "/accessoire",
  authMiddleware,
  authorize("admin", "responsable"),
  ConcurrentAcc.addProdAcc,
);
router.get(
  "/accessoire",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  ConcurrentAcc.getAllProduitAccessoire,
);
router.get(
  "/accessoire/:id",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  ConcurrentAcc.getProduitAccessoireById,
);
router.put(
  "/accessoire/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  ConcurrentAcc.updateProdAcc,
);
router.delete(
  "/accessoire/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  ConcurrentAcc.deleteProdAcc,
);

// ---------------------- APPAREILLAGE ----------------------
router.post(
  "/appareillage",
  authMiddleware,
  authorize("admin", "responsable"),
  ConcurrentApp.addProdApp,
);
router.get(
  "/appareillage",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  ConcurrentApp.getAllProduitApp,
);
router.get(
  "/appareillage/:id",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  ConcurrentApp.getProduitAppById,
);
router.put(
  "/appareillage/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  ConcurrentApp.updateProdApp,
);
router.delete(
  "/appareillage/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  ConcurrentApp.deleteProdApp,
);

// ---------------------- DISJONCTEUR ----------------------
router.post(
  "/disjoncteur",
  authMiddleware,
  authorize("admin", "responsable"),
  ConcurrentDisj.addProdDisj,
);
router.get(
  "/disjoncteur",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  ConcurrentDisj.getProduitDisjoncteur,
);
router.get(
  "/disjoncteur/:id",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  ConcurrentDisj.getProduitDisjoncteurById,
);
router.put(
  "/disjoncteur/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  ConcurrentDisj.updateProdDisj,
);
router.delete(
  "/disjoncteur/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  ConcurrentDisj.deleteProdDisj,
);

// ---------------------- LAMPE ----------------------
router.post(
  "/lampe",
  authMiddleware,
  authorize("admin", "responsable"),
  ConcurrentLamp.addProdLamp,
);
router.get(
  "/lampe",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  ConcurrentLamp.getProduitLampe,
);
router.get(
  "/lampe/:id",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  ConcurrentLamp.getProduitLampeById,
);
router.put(
  "/lampe/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  ConcurrentLamp.updateProdLamp,
);
router.delete(
  "/lampe/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  ConcurrentLamp.deleteProdLamp,
);

module.exports = router;
