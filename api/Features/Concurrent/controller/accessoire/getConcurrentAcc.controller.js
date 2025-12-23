const ConcurrentAccessoire = require("../../model/ConcurrentAccessoire");

const getAllConcurrentAccessoire = async (req, res) => {
  try {
    const items = await ConcurrentAccessoire.findAll();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getConcurrentAccessoireById = async (req, res) => {
  try {
    const item = await ConcurrentAccessoire.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllConcurrentAccessoire,
  getConcurrentAccessoireById,
};
