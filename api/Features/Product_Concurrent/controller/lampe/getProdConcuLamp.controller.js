const ProdConcurrentLampe = require("../../model/ProdConcurrentLampe");

const getAllProdConcurrentLampe = async (req, res) => {
  try {
    const items = await ProdConcurrentLampe.findAll();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProdConcurrentLampeById = async (req, res) => {
  try {
    const item = await ProdConcurrentLampe.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllProdConcurrentLampe,
  getProdConcurrentLampeById,
};
