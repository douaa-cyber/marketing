const db = require("../config/database.js");
const User = require("../Features/User/model/User.js");
const Mission = require("../Features/Mission/model/Mission.js");
const Formulaire = require("../Features/form/model/Formulaire.js");
const Cadeau = require("../Features/Cadeau/model/Cadeau.js");
const CadeauForm = require("../Features/form/model/Form_Cadeau.js");
const AlgeriaCities = require("../Features/Location/model/AlgeriaCities.js");
const ConcurrentLampe = require("../Features/Concurrent/model/ConcurrentLampe.js");
const ConcurrentAccessoire = require("../Features/Concurrent/model/ConcurrentAccessoire.js");
const ConcurrentAppareillage = require("../Features/Concurrent/model/ConcurrentAppareillage.js");
const ConcurrentDisjoncteur = require("../Features/Concurrent/model/ConcurrentDisjoncteur.js");
const ProduitLampe = require("../Features/Product/model/ProduitLampe.js");
const ProduitAppareillage = require("../Features/Product/model/ProduitAppareillage.js");
const ProduitAccessoire = require("../Features/Product/model/ProduitAccessoire.js");
const ProduitDisjoncteur = require("../Features/Product/model/ProduitDisjoncteur.js");
const Form_ProdLampe = require("../Features/form/model/Form_ProduitLampe.js");
const Form_ProdAppareillage = require("../Features/form/model/Form_ProdAppareillage.js");
const Form_ProdAccessoire = require("../Features/form/model/Form_ProdAccessoire.js");
const Form_ProdDisj = require("../Features/form/model/Form_ProdDisjoncteur.js");
const Form_ConcuLampe = require("../Features/form/model/Form_ConcuLampe.js");
const Form_ConcuAccessoire = require("../Features/form/model/Form_ConcuAccess.js");
const Form_ConcuApp = require("../Features/form/model/Form_ConcuApp.js");
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
Formulaire.belongsToMany(ProduitLampe, {
  through: Form_ProdLampe,
});

ProduitLampe.belongsToMany(Formulaire, {
  through: Form_ProdLampe,
});

Formulaire.belongsToMany(ProduitAppareillage, {
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
});
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

Formulaire.belongsToMany(ConcurrentLampe, {
  through: Form_ConcuLampe,
});

ConcurrentLampe.belongsToMany(Formulaire, {
  through: Form_ConcuLampe,
});

Formulaire.belongsToMany(ConcurrentAccessoire, {
  through: Form_ConcuAccessoire,
});

ConcurrentAccessoire.belongsToMany(Formulaire, {
  through: Form_ConcuAccessoire,
});

Formulaire.belongsToMany(ConcurrentAppareillage, {
  through: Form_ConcuApp,
});

ConcurrentAppareillage.belongsToMany(Formulaire, {
  through: Form_ConcuApp,
});
Formulaire.belongsToMany(ConcurrentDisjoncteur, {
  through: Form_ConcuDisj,
});

ConcurrentDisjoncteur.belongsToMany(Formulaire, {
  through: Form_ConcuDisj,
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
  ConcurrentLampe,
  ConcurrentAccessoire,
  ConcurrentAppareillage,
  ConcurrentDisjoncteur,
  ProduitLampe,
  ProduitAppareillage,
  ProduitDisjoncteur,
  Form_ProdLampe,
  Form_ProdAppareillage,
  Form_ProdAccessoire,
  Form_ProdDisj,
  Form_ConcuLampe,
  Form_ConcuAccessoire,
  Form_ConcuApp,
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
