const SourceAppro = require("../model/SourceApprovisionement");

const updateSourceAppro = async (req, res) => {
  try {
    const source = await SourceAppro.findByPk(req.params.id);
    if (!source) {
      return res.status(404).json({ message: "SourceAppro not found" });
    }
    await source.update(req.body);
    res.status(200).json(source);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = updateSourceAppro;
