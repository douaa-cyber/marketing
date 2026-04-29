const Form = require("../model/Formulaire");
const Form_SourceAppro = require("../model/Form_SourceAppro");
const Form_Cadeau = require("../model/Form_Cadeau");
const Form_Critere = require("../model/Form_critere");
const Form_Action = require("../model/Form_action");
const fs = require("fs");
const path = require("path");
const Form_Concu = require("../model/Form_Concu");
const Form_Prod = require("../model/Form_Prod");
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

    if (req.file && req.file.path) {
      const ext = path.extname(req.file.path) || ".webp";
      const newFilename = `form-${form.ID}${ext}`;
      const newPath = path.join(path.dirname(req.file.path), newFilename);

      fs.renameSync(req.file.path, newPath);

      form.Image = path.join("uploads", newFilename);
      await form.save();
    }
    // Parcours des catégories
    for (const cat of Object.keys(selections)) {
      const sel = selections[cat];
      const categorieId = Number(sel.categorieId);

      // Produits
      await Promise.all(
        (sel.produits || []).map((p) => {
          const produitId = Number(p.produitId);
          if (!produitId) return null;

          return Form_Prod.create({
            formId: form.ID,
            produitId,
            categorieId,
            nbArticle: sel.nbr_article ?? 0,
            nbArticleCommande: sel.nbr_article_commande ?? 0,
          });
        }),
      );

      // Concurrents
      await Promise.all(
        (sel.concurrents || []).map((c) => {
          const concurrentId = Number(c.concurrentId);
          if (!concurrentId) return null;

          return Form_Concu.create({
            formId: form.ID,
            concurrentId,
            categorieId,
          });
        }),
      );

      await Promise.all(
        (sel.prodConcurrents || []).map((c) => {
          const concurrentId = Number(c.concurrentId);
          if (!concurrentId) return null;

          return Form_Concu.create({
            formId: form.ID,
            concurrentId,
            categorieId,
          });
        }),
      );

      // ProdConcurrents
      await Promise.all(
        (sel.prodConcurrents || []).map((pc) => {
          const id = Number(pc.prodConcurrentId);
          if (!id) return null;
          return Form_Concu.create({
            formId: form.ID,
            prodConcuId: id,
            categorieId,
          });
        }),
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
