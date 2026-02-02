const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/Auth");
const StatController = require("./AcceuilStats.controller");
router.get("/stats", authMiddleware, StatController.AcceuilStat);

module.exports = router;
