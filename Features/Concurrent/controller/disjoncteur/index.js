const createProdDisj = require("./addConcurrentDisj.controller");
const {
  getAllConcurrentDisjoncteur,
  getConcurrentDisjoncteurById,
} = require("./getConcurrentDisj.controller");
const updateProdDisj = require("./updateConcurrentDisj.controller");
const deleteProdDisj = require("./deleteConcurrentDisj.controller");

module.exports = {
  createProdDisj,
  getAllConcurrentDisjoncteur,
  getConcurrentDisjoncteurById,
  updateProdDisj,
  deleteProdDisj,
};
