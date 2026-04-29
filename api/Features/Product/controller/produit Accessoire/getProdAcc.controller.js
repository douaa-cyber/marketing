const Categorie = require("../../../Categorie/categorie.model");
const Produit = require("../../model/Produit");

const getAllProduit = async (req, res) => {
  try {
    const items = await Produit.findAll({
      include: [
        {
          model: Categorie,
        },
      ],
    });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProduitById = async (req, res) => {
  try {
    const item = await Produit.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Produit not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProduitById,
  getAllProduit,
};
