const ProdConcurrentLampe = require("../model/ProdConcurrentLampe");

const updateProdConcurrentLampe = async (req, res) => {
  try {
    const item = await ProdConcurrentLampe.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Not found" });
    }
    await item.update(req.body);
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = updateProdConcurrentLampe;
