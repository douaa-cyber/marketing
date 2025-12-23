const ProdConcurrentDisjoncteur = require("../../model/ProdConcurrentDisjoncteur");

const updateProdConcurrentDisjoncteur = async (req, res) => {
  try {
    const item = await ProdConcurrentDisjoncteur.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Not found" });
    }
    await item.update(req.body);
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = updateProdConcurrentDisjoncteur;
