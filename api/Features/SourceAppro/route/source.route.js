const express = require("express");
const router = express.Router();
const authMiddleware = require("../../../middleware/Auth");

const SourceController = require("../controller/index");

router.get("/all", authMiddleware, SourceController.getAllSourceAppro);
router.get("/:id", authMiddleware, SourceController.getSourceApproById);
router.post("/", authMiddleware, SourceController.addS);
router.put("/:id", authMiddleware, SourceController.updateS);
router.delete("/:id", authMiddleware, SourceController.deleteS);

module.exports = router;
