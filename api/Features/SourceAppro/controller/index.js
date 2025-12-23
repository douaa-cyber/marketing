const addS = require("./addSource.controller");
const {
  getAllSourceAppro,
  getSourceApproById,
} = require("./getSource.controller");
const updateS = require("./updateSource.controller");
const deleteS = require("./deleteSource.controller");

module.exports = {
  addS,
  getAllSourceAppro,
  getSourceApproById,
  updateS,
  deleteS,
};
