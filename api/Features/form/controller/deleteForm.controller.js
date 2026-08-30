// controllers/deleteForm.controller.js
const Form = require("../model/Formulaire");

const Form_SourceAppro = require("../model/Form_SourceAppro");
const Form_Cadeau = require("../model/Form_Cadeau");

const deleteForm = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "ID requis" });

  try {
    /*  // Produits
      await Promise.all([
      form_ProduitLampe.destroy({ where: { formulaireID: id } }),
      Form_ProdAppareillage.destroy({ where: { formulaireID: id } }),
      Form_ProdDisjoncteur.destroy({ where: { formulaireID: id } }),
      Form_ProdAccessoire.destroy({ where: { formulaireID: id } }),
    ]);

    // Concurrents
    await Promise.all([
      Form_ConcuLampe.destroy({ where: { formulaireID: id } }),
      Form_ConcuApp.destroy({ where: { formulaireID: id } }),
      Form_ConcuDisjoncteur.destroy({ where: { formulaireID: id } }),
      Form_ConcuAccess.destroy({ where: { formulaireID: id } }),
    ]);

    // ProdConcurrents
    await Promise.all([
      Form_ProdConcuLampe.destroy({ where: { formulaireID: id } }),
      Form_ProdConcuApp.destroy({ where: { formulaireID: id } }),
      Form_ProdConcuDisj.destroy({ where: { formulaireID: id } }),
      Form_ProdConcuAcc.destroy({ where: { formulaireID: id } }),
    ]);

    // SourceAppro
    await Form_SourceAppro.destroy({ where: { formulaireID: id } });

    // Cadeaux
    await Form_Cadeau.destroy({ where: { form_id: id } }); */

    await Form.destroy({ where: { ID: id } });

    res.json({ message: "Formulaire et toutes ses données supprimés" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { deleteForm };
