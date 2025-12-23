const {
  createProdConcurrentAccessoire,
} = require("./addProdConcuAcc.controller");

const deleteProdConcuAcc = require("./deleteProdConcuAcc.controller");

const {
  getAllProdConcurrentAccessoire,
  getProdConcurrentAccessoireById,
} = require("./getProdConcuAcc.controller");

const updateProdConcuAcc = require("./updateProdConcuAcc.controller");

module.exports = {
  createProdConcurrentAccessoire,
  deleteProdConcuAcc,
  getAllProdConcurrentAccessoire,
  getProdConcurrentAccessoireById,
  updateProdConcuAcc,
};
