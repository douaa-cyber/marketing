const ConcurrentAppareillage = require("../../model/ConcurrentAppareillage");

const updateConcurrentAppareillage = async (req, res) => {
  try {
    const item = await ConcurrentAppareillage.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Not found" });
    }
    await item.update(req.body);
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  updateConcurrentAppareillage,
};
