const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Formulaire = sequelize.define(
  "formulaire",
  {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    utilisateur_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    Fullname: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    Tel: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },

    nom_magasin: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    longitude: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    latitude: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    algeriaCitiesId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    Activite: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    produitLampeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    produitAppareillageId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    produitDisjoncteurId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    produitAccessoireId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    concurrentLampeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    concurrentAppareillageId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    concurrentDisjoncteurId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ConcurrentProduitAccessoireId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    ConcurrentProduitLampeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ConcurrentProduitAppareillageId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ConcurrentProduitDisjoncteurId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ConcurrentProduitAccessoireId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    SourceApproId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    SatisfactionCli: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    evalueBms: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    evaluconcurrent: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },

    commentaire: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    espacepub: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    Image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    plaque: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

module.exports = Formulaire;
