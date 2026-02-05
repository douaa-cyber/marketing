const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/Auth");
const StatController = require("./AcceuilStats.controller");
const DashboardController = require("./dashboardStats.controller");

router.get("/", authMiddleware, DashboardController.getStatsVisitesUniques);
router.get("/stats", authMiddleware, StatController.AcceuilStat);

module.exports = router;
