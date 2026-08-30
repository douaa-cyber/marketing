const express = require("express");
const router = express.Router();
const authMiddleware = require("../../../middleware/Auth");
const UserController = require("../controller/index");
const authorize = require("../../../middleware/Authorize");

router.get(
  "/profile",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  UserController.getProfile,
);
router.get(
  "/all",
  authMiddleware,
  authorize("admin", "responsable"),
  UserController.getAllUsers,
);
router.get(
  "/agents",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  UserController.getAllUsersFullnameAndUsername,
);
router.get(
  "/:id",
  authMiddleware,
  authorize("admin", "responsable", "marketeur"),
  UserController.getUserById,
);
router.post(
  "/",
  authMiddleware,
  authorize("admin", "responsable"),
  UserController.addUser,
);
router.put(
  "/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  UserController.UpdateUser,
);
router.delete(
  "/:id",
  authMiddleware,
  authorize("admin", "responsable"),
  UserController.DeleteUser,
);

module.exports = router;
