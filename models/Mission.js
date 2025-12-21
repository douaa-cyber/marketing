const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Mission = sequelize.define(
  "mission",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    Objectif: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    date_deb: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    date_fin: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    region: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    wilaya: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("ENCOURS", "TERMINE", "ANNULE"),
      allowNull: false,
      defaultValue: "ENCOURS",
    },

    agent_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    responsable_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

module.exports = Mission;
