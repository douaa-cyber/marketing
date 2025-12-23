const addProdAcc = require("./addProdAcc.controller");
const deleteProdAcc = require("./deleteProdAcc.controller");
const updateProdAcc = require("./updateProdAcc.controller");
const {
  getAllProduitAccessoire,
  getProduitAccessoireById,
} = require("./getProdAcc.controller");

module.exports = {
  addProdAcc,
  deleteProdAcc,
  updateProdAcc,
  getAllProduitAccessoire,
  getProduitAccessoireById,
};
