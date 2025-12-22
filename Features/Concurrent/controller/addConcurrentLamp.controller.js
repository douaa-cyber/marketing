const ConcurrentLampe = require("../model/ConcurrentLampe");

const createConcurrentLampe = async (req, res) => {
  try {
    const item = await ConcurrentLampe.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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

const updateConcurrentLampe = async (req, res) => {
  try {
    const item = await ConcurrentLampe.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Not found" });
    }
    await item.update(req.body);
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteConcurrentLampe = async (req, res) => {
  try {
    const item = await ConcurrentLampe.findByPk(req.params.id);
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
  createConcurrentLampe,
  getAllConcurrentLampe,
  getConcurrentLampeById,
  updateConcurrentLampe,
  deleteConcurrentLampe,
};
