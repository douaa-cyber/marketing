const {
  createConcurrentDisjoncteur,
} = require("./addConcurrentDisj.controller");
const {
  getAllConcurrentDisjoncteur,
  getConcurrentDisjoncteurById,
} = require("./getConcurrentDisj.controller");
const {
  updateConcurrentDisjoncteur,
} = require("./updateConcurrentDisj.controller");
const {
  deleteConcurrentDisjoncteur,
} = require("./deleteConcurrentDisj.controller");

module.exports = {
  createConcurrentDisjoncteur,
  getAllConcurrentDisjoncteur,
  getConcurrentDisjoncteurById,
  updateConcurrentDisjoncteur,
  deleteConcurrentDisjoncteur,
};
