const { CreateConcurrentAcc } = require("./addConcurrentAcc.controller");
const {
  getAllConcurrentAccessoire,
  getConcurrentAccessoireById,
} = require("./getConcurrentAcc.controller");
const { updateConcurrent } = require("./updateConcurrentAcc.controller");
const {
  deleteConcurrentAccessoire,
} = require("./deleteConcurrentAcc.controller");

module.exports = {
  CreateConcurrentAcc,
  getAllConcurrentAccessoire,
  getConcurrentAccessoireById,
  updateConcurrent,
  deleteConcurrentAccessoire,
};
