const createProdApp = require("./addConcurrentApp.controller");
const {
  getAllConcurrentAppareillage,
  getConcurrentAppareillageById,
} = require("./getConcurrentApp.controller");
const updateProdApp = require("./updateConcurrentApp.controller");
const deleteProdApp = require("./deleteConcurrentApp.controller");

module.exports = {
  createProdApp,
  getAllConcurrentAppareillage,
  getConcurrentAppareillageById,
  updateProdApp,
  deleteProdApp,
};
