const { createCadeau } = require("./addCadeau.controller");
const { GetAllCadeau, GetCadeauById } = require("./getCadeau.controller");
const { UpdateCadeau } = require("./updateCadeau.controller");
const { deleteCadeau } = require("./deleteCadeau.controller");

module.exports = {
  createCadeau,
  GetAllCadeau,
  GetCadeauById,
  UpdateCadeau,
  deleteCadeau,
};
