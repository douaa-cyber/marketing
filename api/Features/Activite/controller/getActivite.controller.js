const Activite = require("../model/Activite");

const GetAllActivite = async (req, res) => {
  try {
    const act = await Activite.findAll();

    if (!act) {
      return res.status(404).json({ message: "Activite introuvable." });
    }

    res.status(200).json(act);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const GetActiviteById = async (req, res) => {
  try {
    const { id } = req.params;
    const act = await Activite.findByPk(id);

    if (!act) {
      return res.status(404).json({ message: "Activite introuvable." });
    }

    res.status(200).json(act);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  GetAllActivite,
  GetActiviteById,
};
