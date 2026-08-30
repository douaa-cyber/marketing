const Categorie = require("../../../Categorie/categorie.model");
const Concurrent = require("../../model/Concurrent");

const getAllConcurrent = async (req, res) => {
  try {
    const items = await Concurrent.findAll({
      include: [
        {
          model: Categorie,
        },
      ],
    });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getConcurrentById = async (req, res) => {
  try {
    const item = await Concurrent.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllConcurrent,
  getConcurrentById,
};
