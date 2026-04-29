const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Vehicule = sequelize.define(
  "Vehicule",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    marque: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    immatriculation: {
      type: DataTypes.STRING(12),
      allowNull: true,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  },
);

module.exports = Vehicule;
