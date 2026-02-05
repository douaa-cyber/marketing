const Form = require("../form/model/Formulaire");
const Mission = require("../Mission/model/Mission");
const { Op } = require("sequelize");
const AcceuilStat = async (req, res) => {
  try {
    const user = req.user;
    const TotalForm = await Form.count({
      where: { utilisateur_id: user.id },
    });
    const TotalMission = await Mission.count({
      where: {
        [Op.or]: [{ agent_id: user.id }, { responsable_id: user.id }],
      },
    });
    const Stats = {
      TotalForm,
      TotalMission,
    };
    res.status(200).json(Stats);
  } catch (e) {
    (console.log("Erreur surviens", e), res.status(500).json(e.error));
  }
};

module.exports = {
  AcceuilStat,
};
