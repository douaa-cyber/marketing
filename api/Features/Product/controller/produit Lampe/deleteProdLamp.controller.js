const ProduitLampe = require("../../model/ProduitLampe");

const deleteProduitLampe = async (req, res) => {
  try {
    const item = await ProduitLampe.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "ProduitLampe not found" });
    }

    await item.destroy();
    res.status(200).json({ message: "ProduitLampe deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = deleteProduitLampe;
