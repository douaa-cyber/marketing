const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/database");

const ConcurrentDisjoncteur = sequelize.define(
  "ConcurrentDisjoncteur",
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

module.exports = ConcurrentDisjoncteur;
