const { createProduitConcu } = require("./addProdConcuAcc.controller");

const deleteProdConcu = require("./deleteProdConcuAcc.controller");

const {
  getAllProdConcu,
  getProdConcuById,
} = require("./getProdConcuAcc.controller");

const updateProdConcu = require("./updateProdConcuAcc.controller");

module.exports = {
  createProduitConcu,
  deleteProdConcu,
  getAllProdConcu,
  getProdConcuById,
  updateProdConcu,
};
