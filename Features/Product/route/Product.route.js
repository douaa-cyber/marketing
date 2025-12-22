const express = require("express");
const router = express.Router();

// Import all product controllers
const ConcurrentAcc = require("../controller/produit Accessoire/index");
const ConcurrentApp = require("../controller/produit Appareillage/index");
const ConcurrentDisj = require("../controller/produit Disjoncteur/index");
const ConcurrentLamp = require("../controller/produit Lampe/index");

// ---------------------- ACCESSOIRE ----------------------
router.post("/accessoire", ConcurrentAcc.addProdAcc);
router.get("/accessoire", ConcurrentAcc.getAllProduitAccessoire);
router.get("/accessoire/:id", ConcurrentAcc.getProduitAccessoireById);
router.put("/accessoire/:id", ConcurrentAcc.updateProdAcc);
router.delete("/accessoire/:id", ConcurrentAcc.deleteProdAcc);

// ---------------------- APPAREILLAGE ----------------------
router.post("/appareillage", ConcurrentApp.addProdApp);
router.get("/appareillage", ConcurrentApp.getAllProduitApp);
router.get("/appareillage/:id", ConcurrentApp.getProduitAppById);
router.put("/appareillage/:id", ConcurrentApp.updateProdApp);
router.delete("/appareillage/:id", ConcurrentApp.deleteProdApp);

// ---------------------- DISJONCTEUR ----------------------
router.post("/disjoncteur", ConcurrentDisj.addProdDisj);
router.get("/disjoncteur", ConcurrentDisj.getProduitDisjoncteur);
router.get("/disjoncteur/:id", ConcurrentDisj.getProduitDisjoncteurById);
router.put("/disjoncteur/:id", ConcurrentDisj.updateProdDisj);
router.delete("/disjoncteur/:id", ConcurrentDisj.deleteProdDisj);

// ---------------------- LAMPE ----------------------
router.post("/lampe", ConcurrentLamp.addProdLamp);
router.get("/lampe", ConcurrentLamp.getProduitLampe);
router.get("/lampe/:id", ConcurrentLamp.getProduitLampeById);
router.put("/lampe/:id", ConcurrentLamp.updateProdLamp);
router.delete("/lampe/:id", ConcurrentLamp.deleteProdLamp);

module.exports = router;
