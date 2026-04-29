const Produit = require("../../model/Produit");

const deleteProduit = async (req, res) => {
  try {
    const item = await Produit.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Produit not found" });
    }
    await item.destroy();
    res.status(200).json({ message: "ProduiAccessoire deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = deleteProduit;
