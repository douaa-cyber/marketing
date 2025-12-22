const ProduitApp = require("../../model/ProduitAppareillage");

const updateProduitApp = async (req, res) => {
  try {
    const item = await ProduitApp.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "ProduitApp not found" });
    }
    await item.update(req.body);
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = updateProduitApp;
