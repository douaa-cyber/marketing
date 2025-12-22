const ProduitDisjoncteur = require("../../model/ProduitDisjoncteur");

const createProduitDisjoncteur = async (req, res) => {
  try {
    const item = await ProduitDisjoncteur.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = createProduitDisjoncteur;
