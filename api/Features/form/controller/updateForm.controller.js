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

const updateForm = async (req, res) => {
  try {
    const formId = parseInt(req.params.id);
    const body = req.body;
    console.log(body);
    const imagePath = req.file ? req.file.path : undefined;
    const plaques = body.plaque;
    const espacepub = body.espacepub;
    const packDetaillant = body.packDetaillant;
    const cadeaux = body.cadeaux ? JSON.parse(body.cadeaux) : [];
    const sourceAppro = body.sourceAppro ? JSON.parse(body.sourceAppro) : [];
    const selections = body.selections ? JSON.parse(body.selections) : {};
    const criteres = body.criteres ? JSON.parse(body.criteres) : [];
    const actions = body.actions ? JSON.parse(body.actions) : [];

    const updatedForm = {
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
    };
    if (imagePath) {
      updatedForm.Image = imagePath;
    }
    await Form.update(updatedForm, { where: { ID: formId } });

    await Promise.all([
      form_ProduitLampe.destroy({ where: { formulaireID: formId } }),
      Form_ProdAppareillage.destroy({ where: { formulaireID: formId } }),
      Form_ProdDisjoncteur.destroy({ where: { formulaireID: formId } }),
      Form_ProdAccessoire.destroy({ where: { formulaireID: formId } }),
      Form_ConcuLampe.destroy({ where: { formulaireID: formId } }),
      Form_ConcuApp.destroy({ where: { formulaireID: formId } }),
      Form_ConcuDisjoncteur.destroy({ where: { formulaireID: formId } }),
      Form_ConcuAccess.destroy({ where: { formulaireID: formId } }),
      Form_ProdConcuLampe.destroy({ where: { formulaireID: formId } }),
      Form_ProdConcuApp.destroy({ where: { formulaireID: formId } }),
      Form_ProdConcuDisj.destroy({ where: { formulaireID: formId } }),
      Form_ProdConcuAcc.destroy({ where: { formulaireID: formId } }),
      Form_SourceAppro.destroy({ where: { formulaireID: formId } }),
      Form_Cadeau.destroy({ where: { form_id: formId } }),
      Form_Critere.destroy({ where: { formulaireID: formId } }),
      Form_Action.destroy({ where: { formulaireID: formId } }),
    ]);

    // Réinsérer toutes les nouvelles relations
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
                  formulaireID: formId,
                  ProduitLampeID: id,
                  nbArticle,
                  nbArticleCommande,
                });
              case "appareillage":
                return Form_ProdAppareillage.create({
                  formulaireID: formId,
                  ProduitAppareillageID: id,
                  nbArticle,
                  nbArticleCommande,
                });
              case "disjoncteur":
                return Form_ProdDisjoncteur.create({
                  formulaireID: formId,
                  ProduitDisjoncteurID: id,
                  nbArticle,
                  nbArticleCommande,
                });
              case "accessoire":
                return Form_ProdAccessoire.create({
                  formulaireID: formId,
                  ProduitAccessoireID: id,
                  nbArticle,
                  nbArticleCommande,
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
                  formulaireID: formId,
                  ConcurrentLampeID: id,
                });
              case "appareillage":
                return Form_ConcuApp.create({
                  formulaireID: formId,
                  ConcurrentAppareillageID: id,
                });
              case "disjoncteur":
                return Form_ConcuDisjoncteur.create({
                  formulaireID: formId,
                  ConcurrentDisjoncteurID: id,
                });
              case "accessoire":
                return Form_ConcuAccess.create({
                  formulaireID: formId,
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
                  formulaireID: formId,
                  ProdConcurrentLampeID: id,
                });
              case "appareillage":
                return Form_ProdConcuApp.create({
                  formulaireID: formId,
                  ProdConcurrentAppareillageID: id,
                });
              case "disjoncteur":
                return Form_ProdConcuDisj.create({
                  formulaireID: formId,
                  ProdConcurrentDisjID: id,
                });
              case "accessoire":
                return Form_ProdConcuAcc.create({
                  formulaireID: formId,
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
            formulaireID: formId,
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
            form_id: formId,
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
            formulaireID: formId,
            CritereId: critId,
            is_checked: crit.is_checked ? 1 : 0,
          });
        })
        .filter(Boolean),
    );
    await Promise.all(
      actions
        .map((act) => {
          const actId = Number(act.ActionMarketingId);
          if (!actId) return null;

          return Form_Action.create({
            formulaireID: formId,
            ActionMarketingId: actId,
            is_checked: act.is_checked ? 1 : 0,
          });
        })
        .filter(Boolean),
    );
    res.status(200).json({ message: "Form mis à jour avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { updateForm };
