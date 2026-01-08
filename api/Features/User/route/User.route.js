const express = require("express");
const router = express.Router();
const authorize = require("../../../middleware/Authorize");
const authMiddleware = require("../../../middleware/Auth");
const UserController = require("../controller/index");

router.get("/profile", authMiddleware, UserController.getProfile);
router.get("/all", authMiddleware, UserController.getAllUsers);
router.get(
  "/agents",
  authMiddleware,
  UserController.getAllUsersFullnameAndUsername
);
router.get("/:id", authMiddleware, UserController.getUserById);
router.post("/", authMiddleware, UserController.addUser);
router.put("/:id", authMiddleware, UserController.UpdateUser);
router.delete("/:id", authMiddleware, UserController.DeleteUser);

module.exports = router;
