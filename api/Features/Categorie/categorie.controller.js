const Categorie = require("./categorie.model");

const createCategorie = async (req, res) => {
  try {
    const newCategorie = await Categorie.create(req.body);
    res.status(201).json(newCategorie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCategorie = async (req, res) => {
  try {
    const { id } = req.params;

    const Categorie = await Categorie.findByPk(id);
    if (!Categorie) {
      return res.status(404).json({ message: "Categorie introuvable." });
    }

    await Categorie.destroy();
    res.json({ message: "Categorie supprimée." });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Erreur lors de la suppression." });
  }
};

const GetAllCategorie = async (req, res) => {
  try {
    const cad = await Categorie.findAll();

    if (!cad) {
      return res.status(404).json({ message: "Categorie introuvable." });
    }

    res.status(200).json(cad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const GetCategorieById = async (req, res) => {
  try {
    const { id } = req.params;
    const cad = await Categorie.findByPk(id);

    if (!cad) {
      return res.status(404).json({ message: "Categorie introuvable." });
    }

    res.status(200).json(cad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const UpdateCategorie = async (req, res) => {
  try {
    const { id } = req.params;

    const { name } = req.body;

    const cad = await Categorie.findByPk(id);

    if (!cad) {
      return res.status(404).json({ message: "Categorie introuvable." });
    }

    await cad.update({ name });
    res.status(200).json({
      message: "Categorie mise à jour avec succès.",
      data: cad,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  UpdateCategorie,
  createCategorie,
  deleteCategorie,
  GetAllCategorie,
  GetCategorieById,
};
