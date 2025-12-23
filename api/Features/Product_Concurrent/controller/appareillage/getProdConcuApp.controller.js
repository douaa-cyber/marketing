const ProdConcurrentAppareillage = require("../../model/ProdConcurrentAppareillage");

const getAllProdConcurrentAppareillage = async (req, res) => {
  try {
    const items = await ProdConcurrentAppareillage.findAll();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProdConcurrentAppareillageById = async (req, res) => {
  try {
    const item = await ProdConcurrentAppareillage.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllProdConcurrentAppareillage,
  getProdConcurrentAppareillageById,
};
