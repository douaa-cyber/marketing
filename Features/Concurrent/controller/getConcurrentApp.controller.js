const ConcurrentAppareillage = require("../model/ConcurrentAppareillage");

const getAllConcurrentAppareillage = async (req, res) => {
  try {
    const items = await ConcurrentAppareillage.findAll();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getConcurrentAppareillageById = async (req, res) => {
  try {
    const item = await ConcurrentAppareillage.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllConcurrentAppareillage,
  getConcurrentAppareillageById,
};
