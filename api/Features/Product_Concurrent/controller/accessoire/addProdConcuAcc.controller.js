const ProdConcurrentAccessoire = require("../../model/ProdConcurrentAccessoire");

const createProdConcurrentAccessoire = async (req, res) => {
  try {
    const item = await ProdConcurrentAccessoire.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProdConcurrentAccessoire,
};
