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

// Cadeaux
const Cadeau = require("../../Cadeau/model/Cadeau");

const getAllForms = async (req, res) => {
  try {
    const forms = await Formulaire.findAll({
      include: [
        // Produits
        { model: ProduitLampe, through: { attributes: [] } },
        { model: ProduitAppareillage, through: { attributes: [] } },
        { model: ProduitDisjoncteur, through: { attributes: [] } },
        { model: ProduitAccessoire, through: { attributes: [] } },
        // Concurrents
        { model: ConcurrentLampe, through: { attributes: [] } },
        { model: ConcurrentAppareillage, through: { attributes: [] } },
        { model: ConcurrentDisjoncteur, through: { attributes: [] } },
        { model: ConcurrentAccessoire, through: { attributes: [] } },
        // ProdConcurrent
        { model: ProdConcurrentLampe, through: { attributes: [] } },
        { model: ProdConcurrentAppareillage, through: { attributes: [] } },
        { model: ProdConcurrentDisj, through: { attributes: [] } },
        { model: ProdConcurrentAccessoire, through: { attributes: [] } },
        // Cadeaux et SourceAppro
        { model: SourceAppro, through: { attributes: [] } },
        { model: Cadeau, through: { attributes: [] } },
      ],
    });
    console.log(forms);
    res.status(200).json(forms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getFormById = async (req, res) => {
  try {
    const { id } = req.params;

    const form = await Formulaire.findOne({
      where: { ID: id },
      include: [
        // Produits
        { model: ProduitLampe, through: { attributes: [] } },
        { model: ProduitAppareillage, through: { attributes: [] } },
        { model: ProduitDisjoncteur, through: { attributes: [] } },
        { model: ProduitAccessoire, through: { attributes: [] } },
        // Concurrents
        { model: ConcurrentLampe, through: { attributes: [] } },
        { model: ConcurrentAppareillage, through: { attributes: [] } },
        { model: ConcurrentDisjoncteur, through: { attributes: [] } },
        { model: ConcurrentAccessoire, through: { attributes: [] } },
        // ProdConcurrent
        { model: ProdConcurrentLampe, through: { attributes: [] } },
        { model: ProdConcurrentAppareillage, through: { attributes: [] } },
        { model: ProdConcurrentDisj, through: { attributes: [] } },
        { model: ProdConcurrentAccessoire, through: { attributes: [] } },
        // Cadeaux et SourceAppro
        { model: SourceAppro, through: { attributes: [] } },
        { model: Cadeau, through: { attributes: [] } },
      ],
    });

    if (!form) return res.status(404).json({ message: "Form not found" });

    res.status(200).json(form);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllForms,
  getFormById,
};
