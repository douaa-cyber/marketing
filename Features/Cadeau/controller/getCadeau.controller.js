const Cadeau = require("../model/Cadeau");

const GetAllCadeau = async (req, res) => {
  try {
    const cad = await Cadeau.findAll();

    if (!cad) {
      return res.status(404).json({ message: "cadeau introuvable." });
    }

    res.status(200).json(cad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const GetCadeauById = async (req, res) => {
  try {
    const { id } = req.params;
    const cad = await Cadeau.findByPk(id);

    if (!cad) {
      return res.status(404).json({ message: "cadeau introuvable." });
    }

    res.status(200).json(cad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  GetAllCadeau,
  GetCadeauById,
};
