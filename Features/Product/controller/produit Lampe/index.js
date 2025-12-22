const addProdLamp = require("./addProdLamp.controller");
const deleteProdLamp = require("./deleteProdLamp.controller");
const updateProdLamp = require("./updateProdLamp.controller");
const {
  getProduitLampe,
  getProduitLampeById,
} = require("./getProdLamp.controller");

module.exports = {
  addProdLamp,
  deleteProdLamp,
  updateProdLamp,
  getProduitLampe,
  getProduitLampeById,
};
