const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/Auth");
const StatController = require("./AcceuilStats.controller");
const DashboardController = require("./dashboardStats.controller");
const authorize = require("../../middleware/authorize");
router.get(
  "/dashboard",
  authMiddleware,
  authorize("admin", "responsable"),
  DashboardController.getStatsVisitesUniques,
);
router.get(
  "/stats",
  authMiddleware,
  authorize("admin", "responsable"),
  StatController.AcceuilStat,
);
router.get(
  "/ScoreMarchandising",
  authMiddleware,
  authorize("admin", "responsable"),

  DashboardController.getClientScoresByPeriod,
);
router.get(
  "/TauxRupture",
  authMiddleware,
  authorize("admin", "responsable"),

  DashboardController.getRuptureStockStats,
);
router.get(
  "/action",
  authMiddleware,
  authorize("admin", "responsable"),

  DashboardController.getActionByPeriod,
);

module.exports = router;
