const Vehicule = require("../vehicule.model");
const User = require("../../User/model/User");
const getAllVehicule = async (req, res) => {
  try {
    const vehicules = await Vehicule.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["fullname"],
        },
      ],
    });
    res.status(200).json(vehicules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getVehiculeById = async (req, res) => {
  try {
    const vehicule = await Vehicule.findByPk(req.params.id);
    if (!source) {
      return res.status(404).json({ message: "Vehicule not found" });
    }
    res.status(200).json(vehicule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllVehicule,
  getVehiculeById,
};
