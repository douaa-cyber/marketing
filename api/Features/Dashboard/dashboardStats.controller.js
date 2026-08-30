const { Op, fn, col } = require("sequelize");
const Formulaire = require("../form/model/Formulaire");
const User = require("../User/model/User");
const Mission = require("../Mission/model/Mission");
const Critere = require("../Critere/critere.model");
const Action = require("../ActionMarketing/action.model");
const AlgeriaCities = require("../Location/model/AlgeriaCities");
const Form_Prod = require("../form/model/Form_Prod");
const Produit = require("../Product/model/Produit");
const Categorie = require("../Categorie/categorie.model");

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
      const clientKey = f.Fullname;
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

/* const getRuptureStockStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const formulaires = await Formulaire.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate + " 00:00:00", endDate + " 23:59:59"],
        },
      },
      attributes: ["ID", "nom_magasin", "Fullname", "createdAt"],
      include: [
        { model: User, as: "agent", attributes: ["fullname"] },
        { model: AlgeriaCities, as: "city", attributes: ["wilaya", "Commune"] },
        {
          model: Produit,
          through: {
            model: Form_Prod,
            attributes: ["nbArticle", "nbArticleCommande", "categorieId"],
          },
          attributes: ["ID", "name"],
          include: [{ model: Categorie, attributes: ["id", "nom"] }],
        },
      ],
    });
    console.log("forms:", formulaires);
    const clientsMap = {};

    formulaires.forEach((f) => {
      const clientKey = f.Fullname || "Client Inconnu";

      const calculateFamilyScore = (rows) => {
        if (!rows || rows.length === 0) return 0;
        const total = rows.reduce(
          (acc, curr) => acc + (curr.nbArticle || 0),
          0,
        );
        const cmd = rows.reduce(
          (acc, curr) => acc + (curr.nbArticleCommande || 0),
          0,
        );
        return total > 0 ? parseFloat(((cmd / total) * 100).toFixed(1)) : 0;
      };

      const scoresFamilles = {
        Lampes: calculateFamilyScore(f.Form_ProdLampes),
        Accessoires: calculateFamilyScore(f.Form_ProdAccessoires),
        Appareillages: calculateFamilyScore(f.Form_ProdAppareillages),
        Disjoncteurs: calculateFamilyScore(f.Form_ProdDisjs),
      };

      if (!clientsMap[clientKey]) {
        clientsMap[clientKey] = {
          clientName: clientKey,
          region: f.city?.Commune || "N/A",
          wilaya: f.city?.wilaya || "N/A",
          visites: [],
        };
      }

      clientsMap[clientKey].visites.push({
        date: f.createdAt.toISOString().split("T")[0],
        agentName: f.agent?.fullname || "Anonyme",
        scoresFamilles: scoresFamilles,
      });
    });

    const finalResult = Object.values(clientsMap).map((client) => {
      const familles = [
        "Lampes",
        "Accessoires",
        "Appareillages",
        "Disjoncteurs",
      ];

      const famillesMoyennes = familles.map((nom) => {
        const totalTaux = client.visites.reduce(
          (acc, v) => acc + v.scoresFamilles[nom],
          0,
        );
        const moyenne = totalTaux / client.visites.length;
        return { nom, taux: parseFloat(moyenne.toFixed(1)) };
      });

      return { ...client, famillesMoyennes };
    });
    finalResult.sort((a, b) => a.clientName.localeCompare(b.clientName));
    res.status(200).json(finalResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}; */

const getRuptureStockStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const formulaires = await Formulaire.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate + " 00:00:00", endDate + " 23:59:59"],
        },
      },
      attributes: ["ID", "nom_magasin", "Fullname", "createdAt"],
      include: [
        { model: User, as: "agent", attributes: ["fullname"] },
        { model: AlgeriaCities, as: "city", attributes: ["wilaya", "Commune"] },

        {
          model: Produit,
          through: {
            model: Form_Prod,
            attributes: ["nbArticle", "nbArticleCommande", "categorieId"],
          },
          attributes: ["ID", "name"],
          include: [
            {
              model: Categorie,
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    });

    const clientsMap = {};

    formulaires.forEach((f) => {
      const clientKey = f.Fullname || "Client Inconnu";

      const produits = f.Produits || [];

      // 🔥 dynamic category calculation
      const map = {};

      produits.forEach((p) => {
        const catName = p.Categorie?.nom || "Non classé";

        if (!map[catName]) {
          map[catName] = { total: 0, cmd: 0 };
        }

        map[catName].total += p.Form_Prod?.nbArticle || 0;
        map[catName].cmd += p.Form_Prod?.nbArticleCommande || 0;
      });

      const scoresFamilles = {};

      Object.keys(map).forEach((cat) => {
        const { total, cmd } = map[cat];

        scoresFamilles[cat] =
          total > 0 ? parseFloat(((cmd / total) * 100).toFixed(1)) : 0;
      });

      if (!clientsMap[clientKey]) {
        clientsMap[clientKey] = {
          clientName: clientKey,
          region: f.city?.Commune || "N/A",
          wilaya: f.city?.wilaya || "N/A",
          visites: [],
        };
      }

      clientsMap[clientKey].visites.push({
        date: f.createdAt.toISOString().split("T")[0],
        agentName: f.agent?.fullname || "Anonyme",
        scoresFamilles,
      });
    });

    // 🔥 dynamic average per category
    const finalResult = Object.values(clientsMap).map((client) => {
      const allCategories = {};

      client.visites.forEach((v) => {
        Object.entries(v.scoresFamilles).forEach(([cat, value]) => {
          if (!allCategories[cat]) allCategories[cat] = [];
          allCategories[cat].push(value);
        });
      });

      const famillesMoyennes = Object.entries(allCategories).map(
        ([cat, values]) => ({
          nom: cat,
          taux: parseFloat(
            (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1),
          ),
        }),
      );

      return {
        ...client,
        famillesMoyennes,
      };
    });

    finalResult.sort((a, b) => a.clientName.localeCompare(b.clientName));

    res.status(200).json(finalResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
const getActionByPeriod = async (req, res) => {
  try {
    const { startDate, endDate, utilisateur_id } = req.query;

    const totalCriteresBase = await Action.count();
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
      include: [{ model: Action, through: { attributes: [] } }],
    });

    const clientsMap = {};
    console.log(JSON.stringify(formulaires, null, 2));
    formulaires.forEach((f) => {
      const clientKey = f.Fullname;
      const nbCoches = f.ActionMarketings ? f.ActionMarketings.length : 0;
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

module.exports = {
  getStatsVisitesUniques,
  getClientScoresByPeriod,
  getRuptureStockStats,
  getActionByPeriod,
};
