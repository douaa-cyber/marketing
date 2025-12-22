const addProdApp = require("./addProdApp.controller");
const deleteProdApp = require("./deleteProdApp.controller");
const updateProdApp = require("./updateProdApp.controller");
const {
  getAllProduitApp,
  getProduitAppById,
} = require("./getProdApp.controller");

module.exports = {
  addProdApp,
  deleteProdApp,
  updateProdApp,
  getAllProduitApp,
  getProduitAppById,
};
