const Form = require("../model/Formulaire");
const Form_ProdAccessoire = require("../model/Form_ProdAccessoire");
const Form_ProdAppareillage = require("../model/Form_ProdAppareillage");
const form_ProduitLampe = require("../model/Form_ProduitLampe");
const Form_ProdDisjoncteur = require("../model/Form_ProdDisjoncteur");
const Form_ConcuLampe = require("../model/Form_ConcuLampe");
const Form_ConcuApp = require("../model/Form_ConcuApp");
const Form_ConcuDisjoncteur = require("../model/Form_ConcuDisjoncteur");
const Form_ConcuAccess = require("../model/Form_ProdConcuAcc");
const Form_ProdConcuLampe = require("../model/Form_ProdConcuLampe");
const Form_ProdConcuApp = require("../model/Form_ProdConcuApp");
const Form_ProdConcuDisj = require("../model/Form_ProdConcuDisj");
const Form_ProdConcuAcc = require("../model/Form_ProdConcuAcc");
const Form_SourceAppro = require("../model/Form_SourceAppro");
const Form_Cadeau = require("../model/Form_Cadeau");
const createForm = async (req, res) => {
  try {
    const body = req.body;
    const plaques = body.plaques === "true";
    const espacepub = body.espacepub === "true";
    const packDetaillant = body.packDetaillant === "true";
    const cadeaux = body.cadeaux ? JSON.parse(body.cadeaux) : [];
    const sourceAppro = body.sourceAppro ? JSON.parse(body.sourceAppro) : [];
    const selections = body.selections ? JSON.parse(body.selections) : {};

    const form = await Form.create({
      utilisateur_id: parseInt(body.utilisateur_id),
      mission_id: parseInt(body.mission_id),
      Fullname: body.Fullname,
      Tel: body.Tel || null,
      nom_magasin: body.nom_magasin || null,
      latitude: body.latitude || null,
      longitude: body.longitude || null,
      algeriaCitiesId: body.algeriaCitiesId
        ? parseInt(body.algeriaCitiesId)
        : null,
      ActiviteId: body.ActiviteId ? parseInt(body.ActiviteId) : null,
      plaque: plaques,
      espacepub,
      packDetaillant,
      evalueBms: body.evalueBms ? parseInt(body.evalueBms) : 0,
      SatisfactionCli: body.SatisfactionCli
        ? parseInt(body.SatisfactionCli)
        : 0,
      evaluconcurrent: body.evaluconcurrent
        ? parseInt(body.evaluconcurrent)
        : 0,
      commentaire: body.commentaire || null,
    });

    const produitsToInsert = [];

    for (const cat of Object.keys(selections)) {
      const sel = selections[cat];

      // Exemple pour les produits
      (sel.produits || []).forEach((p) => {
        switch (cat) {
          case "lampe":
            form_ProduitLampe.create({
              formulaireID: form.ID,
              ProduitLampeID: p.produitId,
            });
            break;
          case "appareillage":
            Form_ProdAppareillage.create({
              formulaireID: form.ID,
              ProduitAppareillageID: p.produitId,
            });
            break;
          case "disjoncteur":
            Form_ProdDisjoncteur.create({
              formulaireID: form.ID,
              ProduitDisjoncteurID: p.produitId,
            });
            break;
          case "accessoire":
            Form_ProdAccessoire.create({
              formulaireID: form.ID,
              ProduitAccessoireID: p.produitId,
            });
            break;
        }
      });

      // Exemple pour les concurrents
      (sel.concurrents || []).forEach((c) => {
        switch (cat) {
          case "lampe":
            Form_ConcuLampe.create({
              formulaireID: form.ID,
              ConcurrentLampeID: c.concurrentId,
            });
            break;
          case "appareillage":
            Form_ConcuApp.create({
              formulaireID: form.ID,
              ConcurrentAppareillageID: c.concurrentId,
            });
            break;
          case "disjoncteur":
            Form_ConcuDisjoncteur.create({
              formulaireID: form.ID,
              ConcurrentDisjoncteurID: c.concurrentId,
            });
            break;
          case "accessoire":
            Form_ConcuAccess.create({
              formulaireID: form.ID,
              ConcurrentAccessoireID: c.concurrentId,
            });
            break;
        }
      });

      // Exemple pour prodConcurrents
      (sel.prodConcurrents || []).forEach((pc) => {
        switch (cat) {
          case "lampe":
            Form_ProdConcuLampe.create({
              formulaireID: form.ID,
              ProdConcurrentLampeID: pc.prodConcurrentId,
            });
            break;
          case "appareillage":
            Form_ProdConcuApp.create({
              formulaireID: form.ID,
              ProdConcurrentAppareillageID: pc.prodConcurrentId,
            });
            break;
          case "disjoncteur":
            Form_ProdConcuDisj.create({
              formulaireID: form.ID,
              ProdConcurrentDisjID: pc.prodConcurrentId,
            });
            break;
          case "accessoire":
            Form_ProdConcuAcc.create({
              formulaireID: form.ID,
              ProdConcurrentAccessoireID: pc.prodConcurrentId,
            });
            break;
        }
      });
    }

    await Promise.all(
      sourceAppro.map((id) =>
        Form_SourceAppro.create({
          formulaireID: form.ID,
          SourceApproID: id,
        })
      )
    );

    await Promise.all(
      cadeaux.map((c) =>
        Form_Cadeau.create({
          cadeau_id: c.cadeauId,
          form_id: form.ID,
          quantity: c.quantite,
        })
      )
    );

    res.status(201).json({ form, message: "Form + produits enregistrés" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createForm };
