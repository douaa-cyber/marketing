const addProdAcc = require("./addProdAcc.controller");
const deleteProdAcc = require("./deleteProdAcc.controller");
const updateProdAcc = require("./updateProdAcc.controller");
const { getAllProduit, getProduitById } = require("./getProdAcc.controller");

module.exports = {
  addProdAcc,
  deleteProdAcc,
  updateProdAcc,
  getAllProduit,
  getProduitById,
};
