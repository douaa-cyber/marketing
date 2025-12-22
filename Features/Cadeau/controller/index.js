const createCadeau = require("./addCadeau.controller");
const { GetAllCadeau, GetCadeauById } = require("./getCadeau.controller");
const updateCadeau = require("./updateCadeau.controller");
const deleteCadeau = require("./deleteCadeau.controller");

module.exports = {
  createCadeau,
  GetAllCadeau,
  GetCadeauById,
  updateCadeau,
  deleteCadeau,
};
