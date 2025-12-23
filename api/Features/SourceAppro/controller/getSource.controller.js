const SourceAppro = require("../model/SourceApprovisionement");

const getAllSourceAppro = async (req, res) => {
  try {
    const sources = await SourceAppro.findAll();
    res.status(200).json(sources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSourceApproById = async (req, res) => {
  try {
    const source = await SourceAppro.findByPk(req.params.id);
    if (!source) {
      return res.status(404).json({ message: "SourceAppro not found" });
    }
    res.status(200).json(source);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllSourceAppro,
  getSourceApproById,
};
