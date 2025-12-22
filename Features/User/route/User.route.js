const express = require("express");
const router = express.Router();
const { authMiddleware, authorize } = require("../../../middleware");
const UserController = require("../controller/index");

router.get("/all", UserController.getAllUsers);
router.get("/:id", UserController.getUserById);
router.post("/", UserController.addUser);
router.put("/:id", UserController.UpdateUser);
router.delete("/:id", UserController.DeleteUser);

module.exports = router;
