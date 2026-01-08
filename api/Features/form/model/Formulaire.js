const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/database");

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

    ActiviteId: {
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
    packDetaillant: {
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
