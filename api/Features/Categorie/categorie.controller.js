const Categorie = require("./categorie.model");
const Produit = require("../Product/model/Produit");
const Concurrent = require("../Concurrent/model/Concurrent");
const ProdConcurrent = require("../Product_Concurrent/model/ProdConcurrent");

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

    const categorie = await Categorie.findByPk(id);
    if (!categorie) {
      return res.status(404).json({ message: "Categorie introuvable." });
    }

    await categorie.destroy();
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
const GetCategorieInfo = async (req, res) => {
  try {
    const cad = await Categorie.findAll({
      include: [
        {
          model: Produit,
          through: {
            attributes: [],
          },
        },
        {
          model: Concurrent,
          through: {
            attributes: [],
          },
        },
        {
          model: ProdConcurrent,
          through: {
            attributes: [],
          },
        },
      ],
    });

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
  GetCategorieInfo,
};
