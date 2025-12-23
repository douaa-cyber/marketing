const ConcurrentAppareillage = require("../../model/ConcurrentAppareillage");

const createConcurrentAppareillage = async (req, res) => {
  try {
    const item = await ConcurrentAppareillage.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createConcurrentAppareillage,
};
