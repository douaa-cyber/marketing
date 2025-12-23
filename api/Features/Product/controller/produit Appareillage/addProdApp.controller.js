const ProduitApp = require("../../model/ProduitAppareillage");

const createProduitApp = async (req, res) => {
  try {
    const item = await ProduitApp.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = createProduitApp;
