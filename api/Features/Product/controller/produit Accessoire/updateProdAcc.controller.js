const ProduitAccessoire = require("../../model/ProduitAccessoire");

const updateProduitAccessoire = async (req, res) => {
  try {
    const item = await ProduitAccessoire.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "ProduitAccessoire not found" });
    }
    await item.update(req.body);
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = updateProduitAccessoire;
