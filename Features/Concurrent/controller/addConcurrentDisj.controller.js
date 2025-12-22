const ConcurrentDisjoncteur = require("../model/ConcurrentDisjoncteur");

const createConcurrentDisjoncteur = async (req, res) => {
  try {
    const item = await ConcurrentDisjoncteur.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateConcurrentDisjoncteur = async (req, res) => {
  try {
    const item = await ConcurrentDisjoncteur.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Not found" });
    }
    await item.update(req.body);
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteConcurrentDisjoncteur = async (req, res) => {
  try {
    const item = await ConcurrentDisjoncteur.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Not found" });
    }
    await item.destroy();
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createConcurrentDisjoncteur,
  getAllConcurrentDisjoncteur,
  getConcurrentDisjoncteurById,
  updateConcurrentDisjoncteur,
  deleteConcurrentDisjoncteur,
};
