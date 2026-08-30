const ProdConcu = require("../../model/ProdConcurrent");

const deleteProdConcu = async (req, res) => {
  try {
    const item = await ProdConcu.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Produit not found" });
    }
    await item.destroy();
    res.status(200).json({ message: "ProdConcu deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = deleteProdConcu;
