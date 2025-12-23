const SourceAppro = require("../model/SourceApprovisionement");

const createSourceAppro = async (req, res) => {
  try {
    const source = await SourceAppro.create(req.body);
    res.status(201).json(source);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = createSourceAppro;
