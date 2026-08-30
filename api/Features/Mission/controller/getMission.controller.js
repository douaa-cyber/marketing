const Objectif = require("../../Objectif/objectif.model");
const Mission = require("../model/Mission");
const { Op } = require("sequelize");
const getAllMissions = async (req, res) => {
  try {
    const missions = await Mission.findAll({
      include: [{ model: Objectif, attributes: ["name"], as: "objectif" }],
    });
    res.status(200).json(missions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMissionById = async (req, res) => {
  try {
    const userId = req.params.id;

    const missions = await Mission.findAll({
      where: {
        status: "ENCOURS",
        [Op.or]: [{ responsable_id: userId }, { agent_id: userId }],
      },
      include: [{ model: Objectif, attributes: ["name"], as: "objectif" }],
      order: [["date_deb", "DESC"]],
      attributes: [
        "id",
        "agent_id",
        "responsable_id",
        "region",
        "wilaya",
        "date_deb",
        "date_fin",
        "clientAVisite",
      ],
    });

    if (!missions || missions.length === 0) {
      return res.status(404).json({ message: "Mission not found" });
    }

    res.status(200).json(missions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getMissionById,
  getAllMissions,
};
