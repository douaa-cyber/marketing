const Form = require("../controller/index");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const authMiddleware = require("../../../middleware/Auth");
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", authMiddleware, upload.single("Image"), Form.createForm);
router.get("/", authMiddleware, Form.getAllForms);
router.get(":id", authMiddleware, Form.getFormById);
router.put("/:id", authMiddleware, Form.updateForm);
router.delete("/:id", authMiddleware, Form.deleteForm);
module.exports = router;
