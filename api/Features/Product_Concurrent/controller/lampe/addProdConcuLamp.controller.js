const ProdConcurrentLampe = require("../../model/ProdConcurrentLampe");

const createProdConcurrentLampe = async (req, res) => {
  try {
    const item = await ProdConcurrentLampe.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = createProdConcurrentLampe;
