const { Op, fn, col } = require("sequelize");
const Formulaire = require("../form/model/Formulaire");

const getStatsVisitesUniques = async (req, res) => {
  try {
    const { dateDebut, dateFin } = req.query;

    const stats = await Formulaire.findAll({
      attributes: [
        "utilisateur_id",
        [fn("COUNT", col("id")), "total_visites_doublons_inclus"],
      ],
      where: {
        createdAt: {
          [Op.between]: [
            new Date(dateDebut + " 00:00:00"),
            new Date(dateFin + " 23:59:59"),
          ],
        },
      },

      group: ["utilisateur_id", "Fullname", "algeriaCitiesId"],
      raw: true,
    });

    const finalResult = stats.reduce((acc, curr) => {
      const userId = curr.utilisateur_id;
      if (!acc[userId]) {
        acc[userId] = { utilisateur_id: userId, nbr_clients_uniques: 0 };
      }
      acc[userId].nbr_clients_uniques += 1;
      return acc;
    }, {});

    res.status(200).json(Object.values(finalResult));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = { getStatsVisitesUniques };
