const ProduitApp = require("../../model/ProduitAppareillage");

const getAllProduitApp = async (req, res) => {
  try {
    const items = await ProduitApp.findAll();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProduitAppById = async (req, res) => {
  try {
    const item = await ProduitApp.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "ProduitApp not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllProduitApp,
  getProduitAppById,
};
