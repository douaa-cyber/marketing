const ProdConcurrentDisjoncteur = require("../model/ProdConcurrentDisjoncteur");

const createProdConcurrentDisjoncteur = async (req, res) => {
  try {
    const item = await ProdConcurrentDisjoncteur.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = createProdConcurrentDisjoncteur;
