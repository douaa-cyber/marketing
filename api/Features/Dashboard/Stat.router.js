const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/Auth");
const StatController = require("./AcceuilStats.controller");
const DashboardController = require("./dashboardStats.controller");

router.get("/dashboard", DashboardController.getStatsVisitesUniques);
router.get("/stats", authMiddleware, StatController.AcceuilStat);
router.get(
  "/ScoreMarchandising",

  DashboardController.getClientScoresByPeriod,
);
router.get(
  "/TauxRupture",

  DashboardController.getRuptureStockStats,
);

module.exports = router;
