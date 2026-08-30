const { CreateConcurrent } = require("./addConcurrentAcc.controller");
const {
  getAllConcurrent,
  getConcurrentById,
} = require("./getConcurrentAcc.controller");
const { updateConcurrent } = require("./updateConcurrentAcc.controller");
const { deleteConcurrent } = require("./deleteConcurrentAcc.controller");

module.exports = {
  CreateConcurrent,
  getAllConcurrent,
  getConcurrentById,
  updateConcurrent,
  deleteConcurrent,
};
