const Concurrent = require("../../model/Concurrent");

const deleteConcurrent = async (req, res) => {
  try {
    const item = await Concurrent.findByPk(req.params.id);
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
  deleteConcurrent,
};
