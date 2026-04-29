const db = require("../config/database.js");
const User = require("../Features/User/model/User.js");
const Mission = require("../Features/Mission/model/Mission.js");
const Formulaire = require("../Features/form/model/Formulaire.js");
const Cadeau = require("../Features/Cadeau/model/Cadeau.js");
const CadeauForm = require("../Features/form/model/Form_Cadeau.js");
const AlgeriaCities = require("../Features/Location/model/AlgeriaCities.js");
const Concurrent = require("../Features/Concurrent/model/Concurrent.js");
const Cat_Concu = require("../Features/Concurrent/model/concurrent_cat.js");
const Produit = require("../Features/Product/model/Produit.js");
const Cat_Prod = require("../Features/Product/model/Produit_cat.js");
const Form_ProdLampe = require("../Features/form/model/Form_ProduitLampe.js");
const Form_ProdAppareillage = require("../Features/form/model/Form_ProdAppareillage.js");
const Form_ProdAccessoire = require("../Features/form/model/Form_ProdAccessoire.js");
const Form_ProdDisj = require("../Features/form/model/Form_ProdDisjoncteur.js");
const Form_ConcuLampe = require("../Features/form/model/Form_ConcuLampe.js");
const Form_ConcuAccessoire = require("../Features/form/model/Form_Concu.js");
const Form_Concu = require("../Features/form/model/Form_Concu.js");
const Form_ConcuDisj = require("../Features/form/model/Form_ConcuDisjoncteur.js");
const ProdConcurrentLampe = require("../Features/Product_Concurrent/model/ProdConcurrentLampe.js");
const Form_ProdConcuLampe = require("../Features/form/model/Form_ProdConcuLampe.js");
const ProdConcurrentAccessoire = require("../Features/Product_Concurrent/model/ProdConcurrentAccessoire.js");
const Form_ProdConcuAcc = require("../Features/form/model/Form_ProdConcuAcc.js");
const ProdConcurrentAppareillage = require("../Features/Product_Concurrent/model/ProdConcurrentAppareillage.js");
const Form_ProdConcuApp = require("../Features/form/model/Form_ProdConcuApp.js");
const ProdConcurrentDisj = require("../Features/Product_Concurrent/model/ProdConcurrentDisjoncteur.js");
const Form_ProdConcuDisj = require("../Features/form/model/Form_ProdConcuDisj.js");
const SourceAppro = require("../Features/SourceAppro/model/SourceApprovisionement.js");
const Form_SourceAppro = require("../Features/form/model/Form_SourceAppro.js");
const Vehicule = require("../Features/vehicule/vehicule.model.js");
const Criteria = require("../Features/Critere/critere.model.js");
const Form_Critere = require("../Features/form/model/Form_critere.js");
const Form_Action = require("../Features/form/model/Form_action.js");
const Action = require("../Features/ActionMarketing/action.model.js");
const Activity = require("../Features/Activite/model/Activite.js");
const Objectif = require("../Features/Objectif/objectif.model.js");
const Categorie = require("../Features/Categorie/categorie.model.js");

/* ========= User ========= */

User.hasOne(Vehicule, {
  foreignKey: "user_id",
  as: "vehicule",
});

Vehicule.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

/* ========= MISSIONS ========= */
User.hasMany(Mission, {
  foreignKey: "agent_id",
  as: "missionsAsAgent",
});

User.hasMany(Mission, {
  foreignKey: "responsable_id",
  as: "missionsAsResponsable",
});

Mission.belongsTo(User, {
  foreignKey: "agent_id",
  as: "agent",
});

Mission.belongsTo(User, {
  foreignKey: "responsable_id",
  as: "responsable",
});

Mission.belongsTo(Vehicule, {
  foreignKey: "vehicule_id",
});

Vehicule.hasMany(Mission, {
  foreignKey: "vehicule_id",
});

Objectif.hasMany(Mission, {
  foreignKey: "objectif_id",
  as: "missions",
});
Mission.belongsTo(Objectif, {
  foreignKey: "objectif_id",
  as: "objectif",
});

/* ========= FORMULAIRES ========= */
User.hasMany(Formulaire, {
  foreignKey: "utilisateur_id",
  as: "formulaires",
});

Formulaire.belongsTo(User, {
  foreignKey: "utilisateur_id",
  as: "agent",
});

Mission.hasMany(Formulaire, {
  foreignKey: "mission_id",
  as: "formulaires",
});

Formulaire.belongsTo(Mission, {
  foreignKey: "mission_id",
  as: "mission",
});

/* ========= FORM LINKED WITH PRODUCTS ========= */

Categorie.belongsToMany(Produit, {
  through: Cat_Prod,
});

Concurrent.belongsToMany(Produit, {
  through: Cat_Prod,
});
Formulaire.belongsToMany(Produit, {
  through: Form_Concu,
  foreignKey: "formId",
});

Produit.belongsToMany(Formulaire, {
  through: Form_Concu,
  foreignKey: "concurrentId",
});
Form_Concu.belongsTo(Categorie, {
  foreignKey: "categorieId",
});

Categorie.hasMany(Form_Concu, {
  foreignKey: "categorieId",
});
/* Formulaire.belongsToMany(ProduitAppareillage, {
  through: Form_ProdAppareillage,
});

ProduitAppareillage.belongsToMany(Formulaire, {
  through: Form_ProdAppareillage,
});

Formulaire.belongsToMany(ProduitAccessoire, {
  through: Form_ProdAccessoire,
});

ProduitAccessoire.belongsToMany(Formulaire, {
  through: Form_ProdAccessoire,
});

Formulaire.belongsToMany(ProduitDisjoncteur, {
  through: Form_ProdDisj,
});

ProduitDisjoncteur.belongsToMany(Formulaire, {
  through: Form_ProdDisj,
}); */
// --- CONFIGURATION À AJOUTER ---

// 1. Lampes
Formulaire.hasMany(Form_ProdLampe, { foreignKey: "formulaireID" });
Form_ProdLampe.belongsTo(Formulaire, { foreignKey: "formulaireID" });

// 2. Accessoires
Formulaire.hasMany(Form_ProdAccessoire, { foreignKey: "formulaireID" });
Form_ProdAccessoire.belongsTo(Formulaire, { foreignKey: "formulaireID" });

// 3. Appareillages
Formulaire.hasMany(Form_ProdAppareillage, { foreignKey: "formulaireID" });
Form_ProdAppareillage.belongsTo(Formulaire, { foreignKey: "formulaireID" });

// 4. Disjoncteurs
Formulaire.hasMany(Form_ProdDisj, { foreignKey: "formulaireID" });
Form_ProdDisj.belongsTo(Formulaire, { foreignKey: "formulaireID" });

/* ========= FORM LINKED WITH CONCURRENT ========= */

Categorie.belongsToMany(Concurrent, {
  through: Cat_Concu,
});

Concurrent.belongsToMany(Categorie, {
  through: Cat_Concu,
});

Formulaire.belongsToMany(Concurrent, {
  through: Form_Concu,
  foreignKey: "formId",
});

Concurrent.belongsToMany(Formulaire, {
  through: Form_Concu,
  foreignKey: "concurrentId",
});

Form_Concu.belongsTo(Categorie, {
  foreignKey: "categorieId",
});

Categorie.hasMany(Form_Concu, {
  foreignKey: "categorieId",
});

/* ========= FORM LINKED WITH PRODUCTS OF CONCURRENT ========= */

Formulaire.belongsToMany(ProdConcurrentLampe, {
  through: Form_ProdConcuLampe,
});

ProdConcurrentLampe.belongsToMany(Formulaire, {
  through: Form_ProdConcuLampe,
});

Formulaire.belongsToMany(ProdConcurrentAccessoire, {
  through: Form_ProdConcuAcc,
});

ProdConcurrentAccessoire.belongsToMany(Formulaire, {
  through: Form_ProdConcuAcc,
});

Formulaire.belongsToMany(Criteria, {
  through: Form_Critere,
});

Action.belongsToMany(Formulaire, {
  through: Form_Action,
});
Formulaire.belongsToMany(Action, {
  through: Form_Action,
});

Criteria.belongsToMany(Formulaire, {
  through: Form_Critere,
});

Formulaire.belongsToMany(ProdConcurrentAppareillage, {
  through: Form_ProdConcuApp,
});

ProdConcurrentAppareillage.belongsToMany(Formulaire, {
  through: Form_ProdConcuApp,
});
Formulaire.belongsToMany(ProdConcurrentDisj, {
  through: Form_ProdConcuDisj,
});

ProdConcurrentDisj.belongsToMany(Formulaire, {
  through: Form_ProdConcuDisj,
});

/* ========= FORM LINKED WITH SOURCE APPRO ========= */

Formulaire.belongsToMany(SourceAppro, {
  through: Form_SourceAppro,
});

SourceAppro.belongsToMany(Formulaire, {
  through: Form_SourceAppro,
});

/* ========= ALGERIA CITIES ========= */
AlgeriaCities.hasMany(Formulaire, {
  foreignKey: "algeriaCitiesId",
  as: "formulaires",
});

Formulaire.belongsTo(AlgeriaCities, {
  foreignKey: "algeriaCitiesId",
  as: "city",
});

/* ========= Activities ========= */

Activity.hasMany(Formulaire, {
  foreignKey: "ActiviteId",
});

Formulaire.belongsTo(Activity, {
  foreignKey: "ActiviteId",
});

/* ========= CADEAUX ========= */
Formulaire.belongsToMany(Cadeau, {
  through: CadeauForm,
  foreignKey: "form_id",
  otherKey: "cadeau_id",
});

Cadeau.belongsToMany(Formulaire, {
  through: CadeauForm,
  foreignKey: "cadeau_id",
  otherKey: "form_id",
});

module.exports = {
  db,
  User,
  Mission,
  Formulaire,
  Cadeau,
  CadeauForm,
  AlgeriaCities,
  Concurrent,
  Produit,
  Form_ProdLampe,
  Form_ProdAppareillage,
  Form_ProdAccessoire,
  Form_ProdDisj,
  Form_ConcuLampe,
  Form_ConcuAccessoire,
  Form_Concu,
  Form_ConcuDisj,
  ProdConcurrentLampe,
  Form_ProdConcuLampe,
  ProdConcurrentAccessoire,
  Form_ProdConcuAcc,
  ProdConcurrentAppareillage,
  Form_ProdConcuApp,
  ProdConcurrentDisj,
  Form_ProdConcuDisj,
  SourceAppro,
  Form_SourceAppro,
};
