const addProdConcuDisj = require("./addProdConcuDisj.controller.js");
const deleteProdConcuDisj = require("./deleteProdConcuDisj.controller.js");
const {
  getAllProdConcurrentDisjoncteur,
  getProdConcurrentDisjoncteurById,
} = require("./getProdConcuDisj.controller.js");
const updateProdConcuDisj = require("./updateProdConcuDisj.controller.js");

module.exports = {
  addProdConcuDisj,
  deleteProdConcuDisj,
  getAllProdConcurrentDisjoncteur,
  getProdConcurrentDisjoncteurById,
  updateProdConcuDisj,
};
