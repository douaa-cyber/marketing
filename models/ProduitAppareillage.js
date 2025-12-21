const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProduitAppareillage = sequelize.define(
  "ProduitAppareillage",
  {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

module.exports = ProduitAppareillage;
