const {
  createConcurrentAppareillage,
} = require("./addConcurrentApp.controller");
const {
  getAllConcurrentAppareillage,
  getConcurrentAppareillageById,
} = require("./getConcurrentApp.controller");
const {
  updateConcurrentAppareillage,
} = require("./updateConcurrentApp.controller");
const {
  deleteConcurrentAppareillage,
} = require("./deleteConcurrentApp.controller");

module.exports = {
  createConcurrentAppareillage,
  getAllConcurrentAppareillage,
  getConcurrentAppareillageById,
  updateConcurrentAppareillage,
  deleteConcurrentAppareillage,
};
