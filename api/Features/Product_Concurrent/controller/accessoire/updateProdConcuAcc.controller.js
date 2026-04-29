const ProdConcurrent = require("../../model/ProdConcurrent");

const updateProdConcu = async (req, res) => {
  try {
    const { name, categorieId } = req.body;
    const item = await ProdConcurrent.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Produit not found" });
    }
    if (name) item.name = name;
    await item.save();

    if (categorieId) {
      await item.setCategories([categorieId]);
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = updateProdConcu;
