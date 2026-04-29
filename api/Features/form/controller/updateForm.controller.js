const Form = require("../model/Formulaire");

const Form_SourceAppro = require("../model/Form_SourceAppro");
const Form_Cadeau = require("../model/Form_Cadeau");
const Form_Critere = require("../model/Form_critere");
const Form_Action = require("../model/Form_action");
const Form_Prod = require("../model/Form_Prod");
const Form_Concu = require("../model/Form_Concu");
const Form_ProdConcu = require("../model/Form_ProdConcu");

const updateForm = async (req, res) => {
  try {
    const formId = parseInt(req.params.id);
    const body = req.body;
    const file = req.file;
    const form = await Form.findByPk(formId);
    if (!form) return res.status(404).json({ error: "Formulaire introuvable" });

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
    if (file && file.path) {
      const ext = path.extname(file.originalname) || ".webp";
      const newFilename = `form-${form.ID}${ext}`;
      const newPath = path.join(path.dirname(file.path), newFilename);

      if (form.Image && fs.existsSync(form.Image)) {
        fs.unlinkSync(form.Image);
      }

      fs.renameSync(file.path, newPath);

      updatedForm.Image = newPath;
    }
    await Form.update(updatedForm, { where: { ID: formId } });

    await Promise.all([
      Form_Prod.destroy({ where: { formId } }),
      Form_Concu.destroy({ where: { formId } }),
      Form_ProdConcu.destroy({ where: { formId } }),
      Form_SourceAppro.destroy({ where: { formulaireID: formId } }),
      Form_Cadeau.destroy({ where: { form_id: formId } }),
      Form_Critere.destroy({ where: { formulaireID: formId } }),
      Form_Action.destroy({ where: { formulaireID: formId } }),
    ]);

    // Réinsérer toutes les nouvelles relations
    for (const cat of Object.keys(selections)) {
      const sel = selections[cat];
      const categorieId = Number(sel.categorieId);

      // ✅ Produits
      await Promise.all(
        (sel.produits || []).map((p) => {
          const produitId = Number(p.produitId);
          if (!produitId) return null;

          return Form_Prod.create({
            formId,
            produitId,
            categorieId,
            nbArticle: sel.nbr_article ?? 0,
            nbArticleCommande: sel.nbr_article_commande ?? 0,
          });
        }),
      );

      // ✅ Concurrents
      await Promise.all(
        (sel.concurrents || []).map((c) => {
          const concurrentId = Number(c.concurrentId);
          if (!concurrentId) return null;

          return Form_Concu.create({
            formId,
            concurrentId,
            categorieId,
          });
        }),
      );

      // ProdConcurrents
      await Promise.all(
        (sel.prodConcurrents || [])
          .map((pc) => {
            const id = Number(pc.prodConcurrentId);
            if (!id) return null;

            return Form_ProdConcu.create({
              formId,
              prodConcuId,
              categorieId,
            });
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
          const actId = Number(act.actionId || act.ActionMarketingId);
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
