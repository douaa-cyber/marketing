const { Op, fn, col } = require("sequelize");
const Formulaire = require("../form/model/Formulaire");
const User = require("../User/model/User");
const Mission = require("../Mission/model/Mission");
const Critere = require("../Critere/critere.model");

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
const getClientScoresByPeriod = async (req, res) => {
  try {
    const { startDate, endDate, utilisateur_id } = req.query;

    const totalCriteresBase = await Critere.count();
    const pointsParCoche = totalCriteresBase > 0 ? 10 / totalCriteresBase : 0;

    const formulaires = await Formulaire.findAll({
      where: {
        utilisateur_id: utilisateur_id,
        createdAt: {
          [Op.between]: [
            new Date(startDate + " 00:00:00"),
            new Date(endDate + " 23:59:59"),
          ],
        },
      },
      include: [
        { model: Critere, as: "Criteres", through: { attributes: [] } },
      ],
    });

    // 1. Groupement par Client (nom_magasin ou Fullname)
    const clientsMap = {};

    formulaires.forEach((f) => {
      const clientKey = f.nom_magasin || f.Fullname;
      const nbCoches = f.Criteres ? f.Criteres.length : 0;
      const scoreVisite = parseFloat((nbCoches * pointsParCoche).toFixed(2));

      if (!clientsMap[clientKey]) {
        clientsMap[clientKey] = {
          clientName: clientKey,
          telephone: f.Tel,
          totalScores: 0,
          visites: [],
        };
      }

      clientsMap[clientKey].totalScores += scoreVisite;
      clientsMap[clientKey].visites.push({
        id: f.ID,
        date: f.createdAt,
        scoreVisite: scoreVisite,
        nbCoches: nbCoches,
        totalCriteres: totalCriteresBase,
      });
    });

    // 2. Calcul des moyennes et statuts globaux
    const finalResult = Object.values(clientsMap).map((c) => {
      const moyenne = parseFloat((c.totalScores / c.visites.length).toFixed(2));

      // Détermination du statut global basé sur la moyenne (votre image)
      let performance = { label: "mauvaise exécution", color: "#EF4444" };
      if (moyenne >= 9)
        performance = { label: "excellence terrain", color: "#10B981" };
      else if (moyenne >= 7)
        performance = { label: "acceptable", color: "#F59E0B" };
      else if (moyenne >= 6)
        performance = { label: "en progression", color: "#3B82F6" };

      return {
        clientName: c.clientName,
        telephone: c.telephone,
        scoreMoyenGlobal: moyenne,
        statutGlobal: performance.label,
        couleurGlobal: performance.color,
        nombreTotalVisites: c.visites.length,
        historiqueVisites: c.visites.sort(
          (a, b) => new Date(b.date) - new Date(a.date),
        ),
      };
    });

    res.json(finalResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getStatsVisitesUniques, getClientScoresByPeriod };
