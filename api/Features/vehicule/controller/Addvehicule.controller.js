const Vehicule = require("../vehicule.model");

const CreateVehicule = async (req, res) => {
  try {
    const vehicule = await Vehicule.create(req.body);
    res.status(201).json(vehicule);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports = CreateVehicule;
