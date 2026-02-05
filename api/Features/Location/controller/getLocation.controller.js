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

const GetLocationForForm = async (req, res) => {
  try {
    const locations = await Location.findAll();

    if (!locations || locations.length === 0) {
      return res.status(404).json({ message: "Location introuvable." });
    }

    const ville = locations.map((v) => ({
      name: `${v.wilaya} - ${v.Daira} - ${v.Commune}`,
      id: v.id,
    }));

    res.status(200).json(ville);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const GetJustWilayas = async (req, res) => {
  try {
    const wilayas = await Location.findAll({
      attributes: ["wilaya"],
      group: ["wilaya"],
      order: [["wilaya", "ASC"]],
    });

    if (!wilayas) {
      return res.status(404).json({ message: "Location introuvable." });
    }

    res.status(200).json(wilayas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  GetAllLocation,
  GetLocationById,
  GetLocationForForm,
  GetJustWilayas,
};
