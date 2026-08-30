const Produit = require("../../model/Produit");

const createProduit = async (req, res) => {
  try {
    const { name, categorieId } = req.body;
    const item = await Produit.create({
      name: name,
    });
    if (categorieId) {
      await item.addCategorie(categorieId);
    }
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = createProduit;
