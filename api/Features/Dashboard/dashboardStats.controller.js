const { Op, fn, col } = require("sequelize");
const Formulaire = require("../form/model/Formulaire");
const User = require("../User/model/User");
const Mission = require("../Mission/model/Mission");

const getStatsVisitesUniques = async (req, res) => {
  try {
    const { dateDebut, dateFin } = req.query;
    if (!dateDebut || !dateFin) {
      return res.status(400).json({ message: "Dates manquantes" });
    }

    const visitesGroupées = await Formulaire.findAll({
      attributes: ["utilisateur_id", "algeriaCitiesId"],
      include: [
        {
          model: User,
          attributes: ["fullname"],
          as: "agent",
        },
        {
          model: Mission,

          where: { status: { [Op.in]: ["TERMINE", "ENCOURS"] } },
          attributes: ["id", "clientAVisite"],
          as: "mission",
        },
      ],
      where: {
        createdAt: {
          [Op.between]: [
            new Date(dateDebut + " 00:00:00"),
            new Date(dateFin + " 23:59:59"),
          ],
        },
      },
      group: ["utilisateur_id", "algeriaCitiesId", "agent.id", "mission.id"],
      raw: true,
      nest: true,
    });

    const calculs = visitesGroupées.reduce((acc, curr) => {
      const userId = curr.utilisateur_id;
      const missionId = curr.mission.id;

      if (!acc[userId]) {
        acc[userId] = {
          id: userId,
          fullname: curr.agent.fullname || "Agent Inconnu",
          visitesUniques: 0,
          objectifTotal: 0,
          missionsTraitees: new Set(),
        };
      }

      acc[userId].visitesUniques += 1;

      if (!acc[userId].missionsTraitees.has(missionId)) {
        acc[userId].objectifTotal += curr.mission.clientAVisite || 0;
        acc[userId].missionsTraitees.add(missionId);
      }

      return acc;
    }, {});

    const finalData = Object.values(calculs).map((agent) => {
      const taux =
        agent.objectifTotal > 0
          ? parseFloat(
              ((agent.visitesUniques / agent.objectifTotal) * 100).toFixed(1),
            )
          : 0;

      return {
        id: agent.id,
        fullname: agent.fullname,
        visitesUniques: agent.visitesUniques,
        objectif: agent.objectifTotal,
        taux,
        status:
          taux < 85 ? "Indiscipline" : taux <= 95 ? "Acceptable" : "Très Bon",
      };
    });

    finalData.sort((a, b) => b.taux - a.taux);
    res.status(200).json(finalData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getStatsVisitesUniques };
