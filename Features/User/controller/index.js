const addUser = require("./addUser.controller");
const UpdateUser = require("./updateUser.controller");
const DeleteUser = require("./deleteUser.controller");
const { getAllUsers, getUserById } = require("./getUser.controller");

module.exports = {
  addUser,
  UpdateUser,
  DeleteUser,
  getAllUsers,
  getUserById,
};
