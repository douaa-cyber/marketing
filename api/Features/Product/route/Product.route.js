const express = require("express");
const router = express.Router();
const authMiddleware = require("../../../middleware/Auth");

// Import all product controllers
const ConcurrentAcc = require("../controller/produit Accessoire/index");
const ConcurrentApp = require("../controller/produit Appareillage/index");
const ConcurrentDisj = require("../controller/produit Disjoncteur/index");
const ConcurrentLamp = require("../controller/produit Lampe/index");

// ---------------------- ACCESSOIRE ----------------------
router.post("/accessoire", authMiddleware, ConcurrentAcc.addProdAcc);
router.get(
  "/accessoire",
  authMiddleware,
  ConcurrentAcc.getAllProduitAccessoire
);
router.get(
  "/accessoire/:id",
  authMiddleware,
  ConcurrentAcc.getProduitAccessoireById
);
router.put("/accessoire/:id", authMiddleware, ConcurrentAcc.updateProdAcc);
router.delete("/accessoire/:id", authMiddleware, ConcurrentAcc.deleteProdAcc);

// ---------------------- APPAREILLAGE ----------------------
router.post("/appareillage", authMiddleware, ConcurrentApp.addProdApp);
router.get("/appareillage", authMiddleware, ConcurrentApp.getAllProduitApp);
router.get(
  "/appareillage/:id",
  authMiddleware,
  ConcurrentApp.getProduitAppById
);
router.put("/appareillage/:id", authMiddleware, ConcurrentApp.updateProdApp);
router.delete("/appareillage/:id", authMiddleware, ConcurrentApp.deleteProdApp);

// ---------------------- DISJONCTEUR ----------------------
router.post("/disjoncteur", authMiddleware, ConcurrentDisj.addProdDisj);
router.get(
  "/disjoncteur",
  authMiddleware,
  ConcurrentDisj.getProduitDisjoncteur
);
router.get(
  "/disjoncteur/:id",
  authMiddleware,
  ConcurrentDisj.getProduitDisjoncteurById
);
router.put("/disjoncteur/:id", authMiddleware, ConcurrentDisj.updateProdDisj);
router.delete(
  "/disjoncteur/:id",
  authMiddleware,
  ConcurrentDisj.deleteProdDisj
);

// ---------------------- LAMPE ----------------------
router.post("/lampe", authMiddleware, ConcurrentLamp.addProdLamp);
router.get("/lampe", authMiddleware, ConcurrentLamp.getProduitLampe);
router.get("/lampe/:id", authMiddleware, ConcurrentLamp.getProduitLampeById);
router.put("/lampe/:id", authMiddleware, ConcurrentLamp.updateProdLamp);
router.delete("/lampe/:id", authMiddleware, ConcurrentLamp.deleteProdLamp);

module.exports = router;
