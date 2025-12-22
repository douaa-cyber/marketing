const Mission = require("../model/Mission");

const deleteMission = async (req, res) => {
  try {
    const mission = await Mission.findByPk(req.params.id);
    if (!mission) {
      return res.status(404).json({ message: "Mission not found" });
    }

    await mission.destroy();
    res.status(200).json({ message: "Mission deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = deleteMission;
