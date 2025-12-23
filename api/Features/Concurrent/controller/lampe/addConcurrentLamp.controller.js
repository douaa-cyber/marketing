const ConcurrentLampe = require("../../model/ConcurrentLampe");

const createConcurrentLampe = async (req, res) => {
  try {
    const item = await ConcurrentLampe.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createConcurrentLampe,
};
