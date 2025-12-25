const Cadeau = require("../model/Cadeau");

const UpdateCadeau = async (req, res) => {
  try {
    const { id } = req.params;

    const { name } = req.body;

    const cad = await Cadeau.findByPk(id);

    if (!cad) {
      return res.status(404).json({ message: "cadeau introuvable." });
    }

    await cad.update({ name });
    res.status(200).json({
      message: "Cadeau mise à jour avec succès.",
      data: cad,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  UpdateCadeau,
};
