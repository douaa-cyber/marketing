const express = require("express");
const router = express.Router();
//const { authMiddleware, authorize } = require("../../../middleware");
const ActiviteController = require("../controller/index");
const authMiddleware = require("../../../middleware/Auth");

router.get("/all", authMiddleware, ActiviteController.GetAllActivite);
router.get("/:id", authMiddleware, ActiviteController.GetActiviteById);
router.post("/", authMiddleware, ActiviteController.createActivite);
router.put("/:id", authMiddleware, ActiviteController.UpdateActivite);
router.delete("/:id", authMiddleware, ActiviteController.deleteActivite);

module.exports = router;
