const Objectif = require("./objectif.model");

const createObjectif = async (req, res) => {
  try {
    const newObjectif = await Objectif.create(req.body);
    res.status(201).json(newObjectif);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteObjectif = async (req, res) => {
  try {
    const { id } = req.params;

    const Objectif = await Objectif.findByPk(id);
    if (!Objectif) {
      return res.status(404).json({ message: "Objectif introuvable." });
    }

    await Objectif.destroy();
    res.json({ message: "Objectif supprimée." });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Erreur lors de la suppression." });
  }
};

const GetAllObjectif = async (req, res) => {
  try {
    const cad = await Objectif.findAll();

    if (!cad) {
      return res.status(404).json({ message: "Objectif introuvable." });
    }

    res.status(200).json(cad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const GetObjectifById = async (req, res) => {
  try {
    const { id } = req.params;
    const cad = await Objectif.findByPk(id);

    if (!cad) {
      return res.status(404).json({ message: "Objectif introuvable." });
    }

    res.status(200).json(cad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const UpdateObjectif = async (req, res) => {
  try {
    const { id } = req.params;

    const { name } = req.body;

    const cad = await Objectif.findByPk(id);

    if (!cad) {
      return res.status(404).json({ message: "Objectif introuvable." });
    }

    await cad.update({ name });
    res.status(200).json({
      message: "Objectif mise à jour avec succès.",
      data: cad,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  UpdateObjectif,
  createObjectif,
  deleteObjectif,
  GetAllObjectif,
  GetObjectifById,
};
