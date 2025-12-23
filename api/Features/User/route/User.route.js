const express = require("express");
const router = express.Router();
const authorize = require("../../../middleware/Authorize");
const authMiddleware = require("../../../middleware/Auth");
const UserController = require("../controller/index");
router.get("/profile", authMiddleware, UserController.getProfile);
router.get("/all", UserController.getAllUsers);
router.get("/:id", UserController.getUserById);
router.post("/", UserController.addUser);
router.put("/:id", UserController.UpdateUser);
router.delete("/:id", UserController.DeleteUser);

module.exports = router;
