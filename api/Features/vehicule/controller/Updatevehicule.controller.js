const Vehicule = require("../vehicule.model");

const updateVehicule = async (req, res) => {
  try {
    const vehicule = await Vehicule.findByPk(req.params.id);
    if (!vehicule) {
      return res.status(404).json({ message: "Vehicule not found" });
    }
    await vehicule.update(req.body);
    res.status(200).json(vehicule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = updateVehicule;
