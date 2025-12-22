const Cadeau = require("../model/Cadeau");

const createCadeau = async (req, res) => {
  try {
    const newCadeau = await Cadeau.create(req.body);
    res.status(201).json(newCadeau);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCadeau,
};
