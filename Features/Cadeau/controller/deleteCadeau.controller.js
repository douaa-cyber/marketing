const Cadeau = require("../model/Cadeau");

const deleteCadeau = async (req, res) => {
  try {
    const { id } = req.params;

    const cadeau = await Cadeau.findByPk(id);
    if (!cadeau) {
      return res.status(404).json({ message: "cadeau introuvable." });
    }

    await cadeau.destroy();
    res.json({ message: "cadeau supprimée." });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Erreur lors de la suppression." });
  }
};

module.exports = {
  deleteCadeau,
};
