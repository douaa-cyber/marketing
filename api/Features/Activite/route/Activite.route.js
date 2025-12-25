const express = require("express");
const router = express.Router();
//const { authMiddleware, authorize } = require("../../../middleware");
const ActiviteController = require("../controller/index");

router.get("/all", ActiviteController.GetAllActivite);
router.get("/:id", ActiviteController.GetActiviteById);
router.post("/", ActiviteController.createActivite);
router.put("/:id", ActiviteController.UpdateActivite);
router.delete("/:id", ActiviteController.deleteActivite);

module.exports = router;
