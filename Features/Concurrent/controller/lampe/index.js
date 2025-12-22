const createProdLamp = require("./addConcurrentLamp.controller");
const {
  getAllConcurrentLampe,
  getConcurrentLampeById,
} = require("./getConcurrentLamp.controller");
const updateProdLamp = require("./updateConcurrentLamp.controller");
const deleteProdLamp = require("./deleteConcurrentLamp.controller");

module.exports = {
  createProdLamp,
  getAllConcurrentLampe,
  getConcurrentLampeById,
  updateProdLamp,
  deleteProdLamp,
};
