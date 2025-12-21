const db = require("../config/database");

const User = require("./User");
const Mission = require("./Mission");
const Formulaire = require("./Formulaire");
const Cadeau = require("./Cadeau");
const CadeauForm = require("./CadeauForm");
const AlgeriaCities = require("./AlgeriaCities");
const ConcurrentLampe = require("./ConcurrentLampe");
const ConcurrentAccessoire = require("./ConcurrentAccessoire");
const ConcurrentAppareillage = require("./ConcurrentAppareillage");
const ConcurrentDisjoncteur = require("./ConcurrentDisjoncteur");
const ProduitLampe = require("./ProduitLampe");
const ProduitAppareillage = require("./ProduitAppareillage");
const ProduitAccessoire = require("./ProduitAccessoire");
const ProduitDisjoncteur = require("./ProduitDisjoncteur");
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

Formulaire.belongsToMany(ConcurrentLampe, {
  through: Form_ConcuLampe,
  foreignKey: "formulaireId",
});

ConcurrentLampe.belongsToMany(Formulaire, {
  through: Form_ConcuLampe,
  foreignKey: "concurrentLampeId",
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
};
