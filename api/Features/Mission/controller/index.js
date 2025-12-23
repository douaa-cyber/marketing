const addM = require("../controller/addMission.controller");
const {
  getAllMissions,
  getMissionById,
} = require("../controller/getMission.controller");
const updateM = require("../controller/updateMission.controller");
const deleteM = require("../controller/deleteMission.controller");

module.exports = {
  addM,
  getAllMissions,
  getMissionById,
  updateM,
  deleteM,
};
