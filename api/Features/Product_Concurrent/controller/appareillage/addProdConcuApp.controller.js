const ProdConcurrentAppareillage = require("../../model/ProdConcurrentAppareillage");

const createProdConcurrentAppareillage = async (req, res) => {
  try {
    const item = await ProdConcurrentAppareillage.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = createProdConcurrentAppareillage;
