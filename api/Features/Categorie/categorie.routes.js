const express = require("express");
const router = express.Router();
const CategorieController = require("./categorie.controller");
const authMiddleware = require("../../middleware/Auth");
const authorize = require("../../middleware/authorize");
router.get(
  "/all",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  CategorieController.GetAllCategorie,
);
router.get(
  "/:id",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  CategorieController.GetCategorieById,
);
router.post(
  "/",
  authMiddleware,
  authorize("admin", "responsable"),
  CategorieController.createCategorie,
);
router.put(
  "/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  CategorieController.UpdateCategorie,
);
router.delete(
  "/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  CategorieController.deleteCategorie,
);

module.exports = router;
