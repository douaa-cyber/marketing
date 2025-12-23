const SourceAppro = require("../model/SourceApprovisionement");

const deleteSourceAppro = async (req, res) => {
  try {
    const source = await SourceAppro.findByPk(req.params.id);
    if (!source) {
      return res.status(404).json({ message: "SourceAppro not found" });
    }
    await source.destroy();
    res.status(200).json({ message: "SourceAppro deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = deleteSourceAppro;
