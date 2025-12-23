const ProduitApp = require("../../model/ProduitAppareillage");

const deleteProduitApp = async (req, res) => {
  try {
    const item = await ProduitApp.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "ProduitApp not found" });
    }
    await item.destroy();
    res.status(200).json({ message: "ProduitApp deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = deleteProduitApp;
