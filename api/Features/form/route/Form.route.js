const Form = require("../controller/index");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const authMiddleware = require("../../../middleware/Auth");
//const upload = multer({ storage: multer.memoryStorage() });
const { upload, convertToWebp } = require("../../../middleware/upload");

router.post(
  "/",
  authMiddleware,
  upload.single("Image"),
  convertToWebp,
  Form.createForm,
);
router.get("/", authMiddleware, Form.getAllForms);

router.get(":id", authMiddleware, Form.getFormById);

router.put("/:id", authMiddleware, upload.single("Image"), Form.updateForm);

router.delete("/:id", authMiddleware, Form.deleteForm);

module.exports = router;
