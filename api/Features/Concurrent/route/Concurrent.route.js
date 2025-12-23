const express = require("express");
const router = express.Router();
const ConcurrentAcc = require("../controller/accessoire/index");
const ConcurrentApp = require("../controller/appareillage/index");
const ConcurrentDisj = require("../controller/disjoncteur/index");
const ConcurrentLamp = require("../controller/lampe/index");

// --- create routes ---
router.post("/accessoire", ConcurrentAcc.CreateConcurrentAcc);
router.post("/appareillage", ConcurrentApp.createConcurrentAppareillage);
router.post("/disjoncteur", ConcurrentDisj.createConcurrentDisjoncteur);
router.post("/lampe", ConcurrentLamp.createConcurrentLampe);

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
router.put("/accessoire/:id", ConcurrentAcc.updateConcurrent);
router.put("/appareillage/:id", ConcurrentApp.updateConcurrentAppareillage);
router.put("/disjoncteur/:id", ConcurrentDisj.updateConcurrentDisjoncteur);
router.put("/lampe/:id", ConcurrentLamp.updateConcurrentLampe);

// --- DELETE routes ---
router.delete("/accessoire/:id", ConcurrentAcc.deleteConcurrentAccessoire);
router.delete("/appareillage/:id", ConcurrentApp.deleteConcurrentAppareillage);
router.delete("/disjoncteur/:id", ConcurrentDisj.deleteConcurrentDisjoncteur);
router.delete("/lampe/:id", ConcurrentLamp.deleteConcurrentLampe);

module.exports = router;
