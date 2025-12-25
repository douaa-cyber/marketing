const Activite = require("../model/Activite");

const UpdateActivite = async (req, res) => {
  try {
    const { id } = req.params;

    const { name } = req.body;

    const act = await Activite.findByPk(id);

    if (!act) {
      return res.status(404).json({ message: "Activite introuvable." });
    }

    await act.update({ name });
    res.status(200).json({
      message: "Activite mise à jour avec succès.",
      data: act,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  UpdateActivite,
};
