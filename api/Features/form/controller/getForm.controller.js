// Formulaire
const Formulaire = require("../model/Formulaire");

// Source d'approvisionnement
const SourceAppro = require("../../SourceAppro/model/SourceApprovisionement");

// Cadeaux
const Cadeau = require("../../Cadeau/model/Cadeau");
const CadeauForm = require("../model/Form_Cadeau");
const Critere = require("../../Critere/critere.model");
const Action = require("../../ActionMarketing/action.model");
const Locat = require("../../Location/model/AlgeriaCities");
const Activity = require("../../Activite/model/Activite");
const User = require("../../User/model/User");
const Form_Prod = require("../model/Form_Prod");
const Form_Concu = require("../model/Form_Concu");
const Categorie = require("../../Categorie/categorie.model");
const Concurrent = require("../../Concurrent/model/Concurrent");
const Produit = require("../../Product/model/Produit");
const ProdConcurrent = require("../../Product_Concurrent/model/ProdConcurrent");
const Form_ProdConcu = require("../model/Form_ProdConcu");
const buildWhereClause = (user) => {
  if (!user) return {};

  if (user.role === "admin") {
    return {};
  }

  if (user.role === "responsable") {
    return {};
  }

  return {
    utilisateur_id: user.id,
  };
};

const simpleInclude = (model, throughModel = null, extraAttrs = []) => ({
  model,
  through: throughModel
    ? { model: throughModel, attributes: [] }
    : { attributes: [] },
  attributes: ["ID", "name", ...extraAttrs],
});
const IncludeForArticles = (model, throughModel = null, extraAttrs = []) => ({
  model,
  through: throughModel
    ? {
        model: throughModel,
        attributes: ["nbArticle", "nbArticleCommande"],
      }
    : { attributes: [] },
  attributes: ["ID", "name", ...extraAttrs],
});

const getAllForms = async (req, res) => {
  try {
    const forms = await Formulaire.findAll({
      where: buildWhereClause(req.user),
      include: [
        {
          model: Produit,
          through: {
            model: Form_Prod,
            attributes: ["nbArticle", "nbArticleCommande", "categorieId"],
          },
          attributes: ["ID", "name"],
          include: [{ model: Categorie, attributes: ["id", "name"] }],
        },

        // ✅ Concurrents (ALL categories)
        {
          model: Concurrent,
          through: {
            model: Form_Concu,
            attributes: ["categorieId"],
          },
          attributes: ["ID", "name"],
          include: [{ model: Categorie, attributes: ["id", "name"] }],
        },
        {
          model: ProdConcurrent,
          through: {
            model: Form_ProdConcu,
            attributes: ["categorieId"],
          },
          attributes: ["ID", "name"],
          include: [{ model: Categorie, attributes: ["id", "name"] }],
        },

        {
          model: SourceAppro,
          through: { attributes: [] },
          attributes: ["ID", "name", "surname"],
        },
        {
          model: Cadeau,
          through: { model: CadeauForm, attributes: ["quantity"] },
          attributes: ["ID", "name"],
        },
        {
          model: Critere,
          through: { attributes: [] },
          attributes: ["id", "nom"],
        },
        {
          model: Action,
          through: { attributes: [] },
          attributes: ["id", "nom"],
        },
        {
          model: Locat,
          as: "city",
          attributes: ["id", "wilaya", "Commune"],
        },
        {
          model: Activity,
          attributes: ["id", "name"],
        },
        {
          model: User,
          as: "agent",
          attributes: ["id", "fullname"],
        },
      ],
    });

    res.status(200).json(forms);
  } catch (error) {
    console.error("getAllForms error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getFormById = async (req, res) => {
  try {
    const { id } = req.params;

    const form = await Formulaire.findOne({
      where: { ID: id },
      include: [
        {
          model: Produit,
          through: {
            model: Form_Prod,
            attributes: ["nbArticle", "nbArticleCommande", "categorieId"],
          },
          attributes: ["ID", "name"],
          include: [{ model: Categorie, attributes: ["id", "name"] }],
        },
        {
          model: Concurrent,
          through: {
            model: Form_Concu,
            attributes: ["categorieId"],
          },
          attributes: ["ID", "name"],
          include: [{ model: Categorie, attributes: ["id", "name"] }],
        },
      ],
    });

    if (!form) return res.status(404).json({ message: "Form not found" });

    res.status(200).json(form);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getLastVisiteDetail = async (req, res) => {
  try {
    const { name, tel } = req.params;
    const LastForm = await Formulaire.findOne({
      where: {
        Fullname: name,
        Tel: tel,
      },
      include: [
        {
          model: Produit,
          through: {
            model: Form_Prod,
            attributes: ["nbArticle", "nbArticleCommande", "categorieId"],
          },
          attributes: ["ID", "name"],
          include: [{ model: Categorie, attributes: ["id", "name"] }],
        },

        // ✅ Concurrents
        {
          model: Concurrent,
          through: {
            model: Form_Concu,
            attributes: ["categorieId"],
          },
          attributes: ["ID", "name"],
          include: [{ model: Categorie, attributes: ["id", "name"] }],
        },
        {
          model: ProdConcurrent,
          through: {
            model: Form_ProdConcu,
            attributes: ["categorieId"],
          },
          attributes: ["ID", "name"],
          include: [{ model: Categorie, attributes: ["id", "name"] }],
        },
        {
          model: SourceAppro,
          through: { attributes: [] },
          attributes: ["ID", "name", "surname"],
        },
        {
          model: Cadeau,
          through: { model: CadeauForm, attributes: ["quantity"] },
          attributes: ["ID", "name"],
        },
        {
          model: Critere,
          through: { attributes: [] },
          attributes: ["id", "nom"],
        },
        {
          model: Action,
          through: { attributes: [] },
          attributes: ["id", "nom"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(LastForm);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  getAllForms,
  getFormById,
  getLastVisiteDetail,
};
