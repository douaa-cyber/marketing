const createProdAcc = require("./addConcurrentAcc.controller");
const {
  getAllConcurrentAccessoire,
  getConcurrentAccessoireById,
} = require("./getConcurrentAcc.controller");
const updateProdAcc = require("./updateConcurrentAcc.controller");
const deleteProdAcc = require("./deleteConcurrentAcc.controller");

module.exports = {
  createProdAcc,
  getAllConcurrentAccessoire,
  getConcurrentAccessoireById,
  updateProdAcc,
  deleteProdAcc,
};
