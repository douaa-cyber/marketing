const addUser = require("./addUser.controller");
const UpdateUser = require("./updateUser.controller");
const DeleteUser = require("./deleteUser.controller");
const {
  getAllUsers,
  getUserById,
  getAllUsersFullnameAndUsername,
} = require("./getUser.controller");
const { getProfile } = require("./getProfile.controller");

module.exports = {
  addUser,
  UpdateUser,
  DeleteUser,
  getAllUsers,
  getUserById,
  getProfile,
  getAllUsersFullnameAndUsername,
};
