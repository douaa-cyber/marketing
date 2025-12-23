const Mission = require("../model/Mission");

const getAllMissions = async (req, res) => {
  try {
    const missions = await Mission.findAll();
    res.status(200).json(missions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMissionById = async (req, res) => {
  try {
    const mission = await Mission.findByPk(req.params.id);
    if (!mission) {
      return res.status(404).json({ message: "Mission not found" });
    }
    res.status(200).json(mission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getMissionById,
  getAllMissions,
};
