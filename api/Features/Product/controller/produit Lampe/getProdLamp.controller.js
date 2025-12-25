const ProduitLampe = require("../../model/ProduitLampe");

const getProduitLampe = async (req, res) => {
  try {
    const item = await ProduitLampe.findAll();
    if (!item) {
      return res.status(404).json({ message: "ProduitLampe not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProduitLampeById = async (req, res) => {
  try {
    const item = await ProduitLampe.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "ProduitLampe not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProduitLampeById,
  getProduitLampe,
};
