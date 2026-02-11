const express = require("express");
const router = express.Router();
const criteriaController = require("./action.controller");

router.get("/", criteriaController.getAllCriteria);

router.post("/", criteriaController.createCriteria);

router.put("/:id", criteriaController.updateCriteria);

router.delete("/:id", criteriaController.deleteCriteria);

module.exports = router;
