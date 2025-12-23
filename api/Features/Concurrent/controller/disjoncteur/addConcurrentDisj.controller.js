const ConcurrentDisjoncteur = require("../../model/ConcurrentDisjoncteur");

const createConcurrentDisjoncteur = async (req, res) => {
  try {
    const item = await ConcurrentDisjoncteur.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createConcurrentDisjoncteur,
};
