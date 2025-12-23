const addProdDisj = require("./addProdDisj.controller");
const deleteProdDisj = require("./deleteProdDisj.controller");
const updateProdDisj = require("./updateProdDisj.controller");
const {
  getProduitDisjoncteur,
  getProduitDisjoncteurById,
} = require("./getProdDisj.controller");

module.exports = {
  addProdDisj,
  deleteProdDisj,
  updateProdDisj,
  getProduitDisjoncteur,
  getProduitDisjoncteurById,
};
