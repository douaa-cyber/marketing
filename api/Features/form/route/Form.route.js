const Form = require("../controller/index");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../../../middleware/Auth");
const { upload, convertToWebp } = require("../../../middleware/upload");
const authorize = require("../../../middleware/authorize");
router.post(
  "/",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  upload.single("Image"),
  convertToWebp,
  Form.createForm,
);
router.get(
  "/",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  Form.getAllForms,
);

router.get(
  ":id",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  Form.getFormById,
);

router.put(
  "/:id",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  upload.single("Image"),
  Form.updateForm,
);

router.delete(
  "/:id",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  Form.deleteForm,
);

module.exports = router;
