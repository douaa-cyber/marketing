const Location = require("../model/AlgeriaCities");

const GetAllLocation = async (req, res) => {
  try {
    const location = await Location.findAll();

    if (!location) {
      return res.status(404).json({ message: "Location introuvable." });
    }

    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const GetLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findByPk(id);

    if (!location) {
      return res.status(404).json({ message: "Location introuvable." });
    }

    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  GetAllLocation,
  GetLocationById,
};
