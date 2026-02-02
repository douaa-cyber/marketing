const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/database");

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
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  },
);

module.exports = SourceAppro;
