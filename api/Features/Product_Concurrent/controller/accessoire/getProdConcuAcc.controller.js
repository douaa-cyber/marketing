const Categorie = require("../../../Categorie/categorie.model");
const ProdConcurrent = require("../../model/ProdConcurrent");

const getAllProdConcu = async (req, res) => {
  try {
    const items = await ProdConcurrent.findAll({
      include: [
        {
          model: Categorie,
        },
      ],
    });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProdConcuById = async (req, res) => {
  try {
    const item = await ProdConcurrent.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Produit not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllProdConcu,
  getProdConcuById,
};
