const ConcurrentLampe = require("../../model/ConcurrentLampe");

const getAllConcurrentLampe = async (req, res) => {
  try {
    const items = await ConcurrentLampe.findAll();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getConcurrentLampeById = async (req, res) => {
  try {
    const item = await ConcurrentLampe.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllConcurrentLampe,
  getConcurrentLampeById,
};
