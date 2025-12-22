const ConcurrentDisjoncteur = require("../model/ConcurrentDisjoncteur");

const getAllConcurrentDisjoncteur = async (req, res) => {
  try {
    const items = await ConcurrentDisjoncteur.findAll();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getConcurrentDisjoncteurById = async (req, res) => {
  try {
    const item = await ConcurrentDisjoncteur.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllConcurrentDisjoncteur,
  getConcurrentDisjoncteurById,
};
