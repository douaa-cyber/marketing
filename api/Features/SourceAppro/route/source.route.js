const express = require("express");
const router = express.Router();

const SourceController = require("../controller/index");

router.get("/all", SourceController.getAllSourceAppro);
router.get("/:id", SourceController.getSourceApproById);
router.post("/", SourceController.addS);
router.put("/:id", SourceController.updateS);
router.delete("/:id", SourceController.deleteS);

module.exports = router;
