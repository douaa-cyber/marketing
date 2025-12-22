const Mission = require("../model/Mission");

const updateMission = async (req, res) => {
  try {
    const mission = await Mission.findByPk(req.params.id);
    if (!mission) {
      return res.status(404).json({ message: "Mission not found" });
    }

    await mission.update(req.body);
    res.status(200).json(mission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = updateMission;
