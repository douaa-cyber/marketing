const express = require("express");
const router = express.Router();
const ConcurrentAcc = require("../controller/accessoire/index");
const ConcurrentApp = require("../controller/appareillage/index");
const ConcurrentDisj = require("../controller/disjoncteur/index");
const ConcurrentLamp = require("../controller/lampe/index");

// --- create routes ---
router.post("accessoire/", ConcurrentAcc.createProdAcc);
router.post("appareillage/", ConcurrentApp.createProdApp);
router.post("disjoncteur/", ConcurrentDisj.createProdDisj);
router.post("lampe/", ConcurrentLamp.createProdLamp);

// --- GET ALL routes ---
router.get("/accessoire", ConcurrentAcc.getAllConcurrentAccessoire);
router.get("/appareillage", ConcurrentApp.getAllConcurrentAppareillage);
router.get("/disjoncteur", ConcurrentDisj.getAllConcurrentDisjoncteur);
router.get("/lampe", ConcurrentLamp.getAllConcurrentLampe);

// --- GET BY ID routes ---
router.get("/accessoire/:id", ConcurrentAcc.getConcurrentAccessoireById);
router.get("/appareillage/:id", ConcurrentApp.getConcurrentAppareillageById);
router.get("/disjoncteur/:id", ConcurrentDisj.getConcurrentDisjoncteurById);
router.get("/lampe/:id", ConcurrentLamp.getConcurrentLampeById);

// --- UPDATE routes ---
router.put("/accessoire/:id", ConcurrentAcc.updateProdAcc);
router.put("/appareillage/:id", ConcurrentApp.updateProdApp);
router.put("/disjoncteur/:id", ConcurrentDisj.updateProdDisj);
router.put("/lampe/:id", ConcurrentLamp.updateProdLamp);

// --- DELETE routes ---
router.delete("/accessoire/:id", ConcurrentAcc.deleteProdAcc);
router.delete("/appareillage/:id", ConcurrentApp.deleteProdApp);
router.delete("/disjoncteur/:id", ConcurrentDisj.deleteProdDisj);
router.delete("/lampe/:id", ConcurrentLamp.deleteProdLamp);

module.exports = router;
