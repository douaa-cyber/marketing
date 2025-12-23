const ProduitLampe = require("../../model/ProduitLampe");

const createProduitLampe = async (req, res) => {
  try {
    const item = await ProduitLampe.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = createProduitLampe;
