// Formulaire
const Formulaire = require("../model/Formulaire");

// Produits
const ProduitLampe = require("../../Product/model/ProduitLampe");
const ProduitAppareillage = require("../../Product/model/ProduitAppareillage");
const ProduitDisjoncteur = require("../../Product/model/ProduitDisjoncteur");
const ProduitAccessoire = require("../../Product/model/ProduitAccessoire");

// Concurrents
const ConcurrentLampe = require("../../Concurrent/model/ConcurrentLampe");
const ConcurrentAppareillage = require("../../Concurrent/model/ConcurrentAppareillage");
const ConcurrentDisjoncteur = require("../../Concurrent/model/ConcurrentDisjoncteur");
const ConcurrentAccessoire = require("../../Concurrent/model/ConcurrentAccessoire");

// Produits des concurrents
const ProdConcurrentLampe = require("../../Product_Concurrent/model/ProdConcurrentLampe");
const ProdConcurrentAppareillage = require("../../Product_Concurrent/model/ProdConcurrentAppareillage");
const ProdConcurrentDisj = require("../../Product_Concurrent/model/ProdConcurrentDisjoncteur");
const ProdConcurrentAccessoire = require("../../Product_Concurrent/model/ProdConcurrentAccessoire");

// Source d'approvisionnement
const SourceAppro = require("../../SourceAppro/model/SourceApprovisionement");
const Form_prodLampe = require("../model/Form_ProduitLampe");
const Form_prodAppareillage = require("../model/Form_ProdAppareillage");
const Form_prodDisj = require("../model/Form_ProdDisjoncteur");
const Form_prodAcc = require("../model/Form_ProdAccessoire");
// Cadeaux
const Cadeau = require("../../Cadeau/model/Cadeau");
const CadeauForm = require("../model/Form_Cadeau");
const Critere = require("../../Critere/critere.model");
const Action = require("../../ActionMarketing/action.model");
const Locat = require("../../Location/model/AlgeriaCities");
const Activity = require("../../Activite/model/Activite");
const User = require("../../User/model/User");
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
        IncludeForArticles(ProduitLampe, Form_prodLampe),
        IncludeForArticles(ProduitAppareillage, Form_prodAppareillage),
        IncludeForArticles(ProduitDisjoncteur, Form_prodDisj),
        IncludeForArticles(ProduitAccessoire, Form_prodAcc),

        simpleInclude(ConcurrentLampe),
        simpleInclude(ConcurrentAppareillage),
        simpleInclude(ConcurrentDisjoncteur),
        simpleInclude(ConcurrentAccessoire),

        simpleInclude(ProdConcurrentLampe),
        simpleInclude(ProdConcurrentAppareillage),
        simpleInclude(ProdConcurrentDisj),
        simpleInclude(ProdConcurrentAccessoire),

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
          model: ProduitLampe,
          through: {
            model: Form_prodLampe,
            attributes: [],
          },
          attributes: ["ID", "name"],
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
    const { name } = req.params;
    const LastForm = await Formulaire.findOne({
      where: {
        Fullname: name,
      },
      include: [
        IncludeForArticles(ProduitLampe, Form_prodLampe),
        IncludeForArticles(ProduitAppareillage, Form_prodAppareillage),
        IncludeForArticles(ProduitDisjoncteur, Form_prodDisj),
        IncludeForArticles(ProduitAccessoire, Form_prodAcc),

        simpleInclude(ConcurrentLampe),
        simpleInclude(ConcurrentAppareillage),
        simpleInclude(ConcurrentDisjoncteur),
        simpleInclude(ConcurrentAccessoire),

        simpleInclude(ProdConcurrentLampe),
        simpleInclude(ProdConcurrentAppareillage),
        simpleInclude(ProdConcurrentDisj),
        simpleInclude(ProdConcurrentAccessoire),

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
