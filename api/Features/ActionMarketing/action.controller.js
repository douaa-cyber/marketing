const Criteria = require("../ActionMarketing/action.model");

const createCriteria = async (req, res) => {
  try {
    const { nom } = req.body;

    if (!nom) {
      return res
        .status(400)
        .json({ message: "Le nom du critère est obligatoire" });
    }

    const exists = await Criteria.findOne({ where: { nom } });
    if (exists) {
      return res.status(400).json({ message: "Ce critère existe déjà" });
    }

    const newCriteria = await Criteria.create(req.body);
    res.status(201).json(newCriteria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllCriteria = async (req, res) => {
  try {
    const criteria = await Criteria.findAll();
    res.status(200).json(criteria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCriteria = async (req, res) => {
  try {
    const { id } = req.params;

    const criteria = await Criteria.findByPk(id);
    if (!criteria) {
      return res.status(404).json({ message: "Critère introuvable" });
    }

    await Criteria.update(req.body, { where: { id } });
    res.status(200).json({ message: "Critère mis à jour" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCriteria = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Criteria.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ message: "Critère introuvable" });
    }

    res.status(200).json({ message: "Critère supprimé" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCriteria,
  getAllCriteria,
  updateCriteria,
  deleteCriteria,
};
