const addProdConcuLamp = require("./addProdConcuLamp.controller.js");
const deleteProdConcuLamp = require("./deleteProdConcuLamp.controller.js");
const {
  getAllProdConcurrentLampe,
  getProdConcurrentLampeById,
} = require("./getProdConcuLamp.controller.js");
const updateProdConcuLamp = require("./updateProdConcuLamp.controller.js");

module.exports = {
  addProdConcuLamp,
  deleteProdConcuLamp,
  getAllProdConcurrentLampe,
  getProdConcurrentLampeById,
  updateProdConcuLamp,
};
