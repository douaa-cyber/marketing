const { createActivite } = require("./addActivite.controller");
const { GetAllActivite, GetActiviteById } = require("./getActivite.controller");
const { UpdateActivite } = require("./updateActivite.controller");
const { deleteActivite } = require("./deleteActivite.controller");

module.exports = {
  createActivite,
  GetAllActivite,
  GetActiviteById,
  UpdateActivite,
  deleteActivite,
};
