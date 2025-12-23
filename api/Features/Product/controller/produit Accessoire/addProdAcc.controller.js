const ProduitAccessoire = require("../../model/ProduitAccessoire");

const createProduitAccessoire = async (req, res) => {
  try {
    const item = await ProduitAccessoire.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = createProduitAccessoire;
