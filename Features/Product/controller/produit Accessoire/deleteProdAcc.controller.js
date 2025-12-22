const ProduitAccessoire = require("../../model/ProduitAccessoire");

const deleteProduitAccessoire = async (req, res) => {
  try {
    const item = await ProduitAccessoire.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "ProduitAccessoire not found" });
    }
    await item.destroy();
    res.status(200).json({ message: "ProduitAccessoire deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = deleteProduitAccessoire;
