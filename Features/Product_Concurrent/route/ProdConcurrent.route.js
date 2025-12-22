const express = require("express");
const router = express.Router();

const AccController = require("../controller/accessoire/index");
const AppController = require("../controller/appareillage/index");
const DisjController = require("../controller/disjoncteur/index");
const LampController = require("../controller/lampe/index");

// --- ROUTES ACCESSOIRE ---
router.get("/accessoire", AccController.getAllProdConcurrentAccessoire);
router.get("/accessoire/:id", AccController.getProdConcurrentAccessoireById);
router.post("/accessoire", AccController.addProdConcuAcc);
router.put("/accessoire/:id", AccController.updateProdConcuAcc);
router.delete("/accessoire/:id", AccController.deleteProdConcuAcc);

// --- ROUTES APPAREILLAGE ---
router.get("/appareillage", AppController.getAllProdConcurrentAppareillage);
router.get(
  "/appareillage/:id",
  AppController.getProdConcurrentAppareillageById
);
router.post("/appareillage", AppController.addProdConcuApp);
router.put("/appareillage/:id", AppController.updateProdConcuApp);
router.delete("/appareillage/:id", AppController.deleteProdConcuApp);

// --- ROUTES DISJONCTEUR ---
router.get("/disjoncteur", DisjController.getAllProdConcurrentDisjoncteur);
router.get("/disjoncteur/:id", DisjController.getProdConcurrentDisjoncteurById);
router.post("/disjoncteur", DisjController.addProdConcuDisj);
router.put("/disjoncteur/:id", DisjController.updateProdConcuDisj);
router.delete("/disjoncteur/:id", DisjController.deleteProdConcuDisj);

// --- ROUTES LAMPE ---
router.get("/lampe", LampController.getAllProdConcurrentLampe);
router.get("/lampe/:id", LampController.getProdConcurrentLampeById);
router.post("/lampe", LampController.addProdConcuLamp);
router.put("/lampe/:id", LampController.updateProdConcuLamp);
router.delete("/lampe/:id", LampController.deleteProdConcuLamp);

module.exports = router;
