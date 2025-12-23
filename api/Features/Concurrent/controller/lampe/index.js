const { createConcurrentLampe } = require("./addConcurrentLamp.controller");
const {
  getAllConcurrentLampe,
  getConcurrentLampeById,
} = require("./getConcurrentLamp.controller");
const { updateConcurrentLampe } = require("./updateConcurrentLamp.controller");
const { deleteConcurrentLampe } = require("./deleteConcurrentLamp.controller");

module.exports = {
  createConcurrentLampe,
  getAllConcurrentLampe,
  getConcurrentLampeById,
  updateConcurrentLampe,
  deleteConcurrentLampe,
};
