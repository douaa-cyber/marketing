const addV = require("./Addvehicule.controller");
const { getAllVehicule, getVehiculeById } = require("./Getvehicule.controller");
const updateV = require("./Updatevehicule.controller");
const deleteV = require("./Deletevehicule.controller");

module.exports = {
  addV,
  getAllVehicule,
  getVehiculeById,
  updateV,
  deleteV,
};
