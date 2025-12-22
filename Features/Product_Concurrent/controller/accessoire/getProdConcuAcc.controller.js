const ProdConcurrentAccessoire = require("../model/ProdConcurrentAccessoire");

const getAllProdConcurrentAccessoire = async (req, res) => {
  try {
    const items = await ProdConcurrentAccessoire.findAll();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProdConcurrentAccessoireById = async (req, res) => {
  try {
    const item = await ProdConcurrentAccessoire.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllProdConcurrentAccessoire,
  getProdConcurrentAccessoireById,
};
