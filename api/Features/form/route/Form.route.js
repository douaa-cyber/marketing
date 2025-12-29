const Form = require("../controller/index");
const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("Image"), Form.createForm);
router.get("/", Form.getAllForms);
router.get(":id", Form.getFormById);
module.exports = router;
