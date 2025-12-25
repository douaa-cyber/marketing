const Activite = require("../model/Activite");

const createActivite = async (req, res) => {
  try {
    const newActivite = await Activite.create(req.body);
    res.status(201).json(newActivite);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createActivite,
};
