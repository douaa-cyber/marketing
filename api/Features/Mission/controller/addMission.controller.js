const Mission = require("../model/Mission");

const createMission = async (req, res) => {
  try {
    console.log(req.body);
    const mission = await Mission.create(req.body);
    res.status(201).json(mission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = createMission;
