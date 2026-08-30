const Concurrent = require("../../model/Concurrent");

const updateConcurrent = async (req, res) => {
  try {
    const { name, categorieId } = req.body;
    const concurrent = await Concurrent.findByPk(req.params.id);

    if (!concurrent) return res.status(404).json({ message: "Not found" });

    if (name) concurrent.name = name;
    await concurrent.save();

    if (categorieId) {
      await concurrent.setCategories([categorieId]);
    }

    res.status(200).json(concurrent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  updateConcurrent,
};
