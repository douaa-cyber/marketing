const Activite = require("../model/Activite");

const deleteActivite = async (req, res) => {
  try {
    const { id } = req.params;

    const activite = await Activite.findByPk(id);
    if (!activite) {
      return res.status(404).json({ message: "Activite introuvable." });
    }

    await activite.destroy();
    res.json({ message: "Activite supprimée." });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Erreur lors de la suppression." });
  }
};

module.exports = {
  deleteActivite,
};
