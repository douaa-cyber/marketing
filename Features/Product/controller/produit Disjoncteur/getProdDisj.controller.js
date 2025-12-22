const ProduitDisjoncteur = require("../../model/ProduitDisjoncteur");

const getProduitDisjoncteur = async (req, res) => {
  try {
    const item = await ProduitDisjoncteur.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "ProduitDisjoncteur not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProduitDisjoncteurById = async (req, res) => {
  try {
    const item = await ProduitDisjoncteur.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "ProduitDisjoncteur not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProduitDisjoncteurById,
  getProduitDisjoncteur,
};
