const ProduitDisjoncteur = require("../../model/ProduitDisjoncteur");

const deleteProduitDisjoncteur = async (req, res) => {
  try {
    const item = await ProduitDisjoncteur.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "ProduitDisjoncteur not found" });
    }

    await item.destroy();
    res
      .status(200)
      .json({ message: "ProduitDisjoncteur deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = deleteProduitDisjoncteur;
