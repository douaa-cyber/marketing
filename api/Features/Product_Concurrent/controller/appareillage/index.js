const addProdConcuApp = require("./addProdConcuApp.controller.js");
const deleteProdConcuApp = require("./deleteProdConcuApp.controller.js");
const {
  getAllProdConcurrentAppareillage,
  getProdConcurrentAppareillageById,
} = require("./getProdConcuApp.controller.js");
const updateProdConcuApp = require("./updateProdConcuApp.controller.js");

module.exports = {
  addProdConcuApp,
  deleteProdConcuApp,
  getAllProdConcurrentAppareillage,
  getProdConcurrentAppareillageById,
  updateProdConcuApp,
};
