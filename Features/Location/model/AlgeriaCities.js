const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/database");

const AlgeriaCities = sequelize.define(
  "AlgeriaCities",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    Commune: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    Daira: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    wilaya: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

module.exports = AlgeriaCities;
