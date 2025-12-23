const ProduitAccessoire = require("../../model/ProduitAccessoire");

const getAllProduitAccessoire = async (req, res) => {
  try {
    const items = await ProduitAccessoire.findAll();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProduitAccessoireById = async (req, res) => {
  try {
    const item = await ProduitAccessoire.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "ProduitAccessoire not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProduitAccessoireById,
  getAllProduitAccessoire,
};
