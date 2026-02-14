const Form = require("../model/Formulaire");
const Form_ProdAccessoire = require("../model/Form_ProdAccessoire");
const Form_ProdAppareillage = require("../model/Form_ProdAppareillage");
const form_ProduitLampe = require("../model/Form_ProduitLampe");
const Form_ProdDisjoncteur = require("../model/Form_ProdDisjoncteur");
const Form_ConcuLampe = require("../model/Form_ConcuLampe");
const Form_ConcuApp = require("../model/Form_ConcuApp");
const Form_ConcuDisjoncteur = require("../model/Form_ConcuDisjoncteur");
const Form_ConcuAccess = require("../model/Form_ConcuAccess");
const Form_ProdConcuLampe = require("../model/Form_ProdConcuLampe");
const Form_ProdConcuApp = require("../model/Form_ProdConcuApp");
const Form_ProdConcuDisj = require("../model/Form_ProdConcuDisj");
const Form_ProdConcuAcc = require("../model/Form_ProdConcuAcc");
const Form_SourceAppro = require("../model/Form_SourceAppro");
const Form_Cadeau = require("../model/Form_Cadeau");
const Form_Critere = require("../model/Form_critere");
const Form_Action = require("../model/Form_action");
const createForm = async (req, res) => {
  try {
    const body = req.body;
    const imagePath = req.file ? req.file.path : null;
    const plaques = body.plaques;
    const espacepub = body.espacepub;
    const packDetaillant = body.packDetaillant;
    const cadeaux = body.cadeaux ? JSON.parse(body.cadeaux) : [];
    const sourceAppro = body.sourceAppro ? JSON.parse(body.sourceAppro) : [];
    const selections = body.selections ? JSON.parse(body.selections) : {};
    const criteres = body.criteres ? JSON.parse(body.criteres) : [];
    const actions = body.actions ? JSON.parse(body.actions) : [];
    console.log("data", actions);
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
      Image: imagePath,
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

    // Parcours des catégories
    for (const cat of Object.keys(selections)) {
      const sel = selections[cat];

      // Produits
      await Promise.all(
        (sel.produits || [])
          .map((p) => {
            const id = Number(p.produitId);
            const nbArticle = sel.nbr_article ?? 0;
            const nbArticleCommande = sel.nbr_article_commande ?? 0;
            if (!id) return null;
            switch (cat) {
              case "lampe":
                return form_ProduitLampe.create({
                  formulaireID: form.ID,
                  ProduitLampeID: id,
                  nbArticle: nbArticle,
                  nbArticleCommande: nbArticleCommande,
                });
              case "appareillage":
                return Form_ProdAppareillage.create({
                  formulaireID: form.ID,
                  ProduitAppareillageID: id,
                  nbArticle: nbArticle,
                  nbArticleCommande: nbArticleCommande,
                });
              case "disjoncteur":
                return Form_ProdDisjoncteur.create({
                  formulaireID: form.ID,
                  ProduitDisjoncteurID: id,
                  nbArticle: nbArticle,
                  nbArticleCommande: nbArticleCommande,
                });
              case "accessoire":
                return Form_ProdAccessoire.create({
                  formulaireID: form.ID,
                  ProduitAccessoireID: id,
                  nbArticle: nbArticle,
                  nbArticleCommande: nbArticleCommande,
                });
            }
          })
          .filter(Boolean),
      );

      // Concurrents
      await Promise.all(
        (sel.concurrents || [])
          .map((c) => {
            const id = Number(c.concurrentId);
            if (!id) return null;
            switch (cat) {
              case "lampe":
                return Form_ConcuLampe.create({
                  formulaireID: form.ID,
                  ConcurrentLampeID: id,
                });
              case "appareillage":
                return Form_ConcuApp.create({
                  formulaireID: form.ID,
                  ConcurrentAppareillageID: id,
                });
              case "disjoncteur":
                return Form_ConcuDisjoncteur.create({
                  formulaireID: form.ID,
                  ConcurrentDisjoncteurID: id,
                });
              case "accessoire":
                return Form_ConcuAccess.create({
                  formulaireID: form.ID,
                  ConcurrentAccessoireID: id,
                });
            }
          })
          .filter(Boolean),
      );

      // ProdConcurrents
      await Promise.all(
        (sel.prodConcurrents || [])
          .map((pc) => {
            const id = Number(pc.prodConcurrentId);
            if (!id) return null;
            switch (cat) {
              case "lampe":
                return Form_ProdConcuLampe.create({
                  formulaireID: form.ID,
                  ProdConcurrentLampeID: id,
                });
              case "appareillage":
                return Form_ProdConcuApp.create({
                  formulaireID: form.ID,
                  ProdConcurrentAppareillageID: id,
                });
              case "disjoncteur":
                return Form_ProdConcuDisj.create({
                  formulaireID: form.ID,
                  ProdConcurrentDisjID: id,
                });
              case "accessoire":
                return Form_ProdConcuAcc.create({
                  formulaireID: form.ID,
                  ProdConcurrentAccessoireID: id,
                });
            }
          })
          .filter(Boolean),
      );
    }

    // SourceAppro
    await Promise.all(
      sourceAppro
        .map((id) => {
          const numId = Number(id);
          if (!numId) return null;
          return Form_SourceAppro.create({
            formulaireID: form.ID,
            SourceApproID: numId,
          });
        })
        .filter(Boolean),
    );

    // Cadeaux
    await Promise.all(
      cadeaux
        .map((c) => {
          const numId = Number(c.cadeauId);
          if (!numId) return null;
          return Form_Cadeau.create({
            form_id: form.ID,
            cadeau_id: numId,
            quantity: c.quantite,
          });
        })
        .filter(Boolean),
    );

    //Critaria

    await Promise.all(
      criteres
        .map((crit) => {
          const critId = Number(crit.critereId);
          if (!critId) return null;

          return Form_Critere.create({
            formulaireID: form.ID,
            CritereId: critId,
            is_checked: crit.is_checked ? 1 : 0,
          });
        })
        .filter(Boolean),
    );
    await Promise.all(
      actions
        .map((act) => {
          const actId = Number(act.actionId);
          if (!actId) return null;

          return Form_Action.create({
            formulaireID: form.ID,
            ActionMarketingId: actId,
            is_checked: act.is_checked ? 1 : 0,
          });
        })
        .filter(Boolean),
    );

    res.status(201).json({ form, message: "Form + produits enregistrés" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createForm };
