const Vehicule = require("../vehicule.model");

const deleteVehicule = async (req, res) => {
  try {
    const vehicule = await Vehicule.findByPk(req.params.id);
    if (!vehicule) {
      return res.status(404).json({ message: "Vehicule not found" });
    }
    await vehicule.destroy();
    res.status(200).json({ message: "vehicule deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = deleteVehicule;
