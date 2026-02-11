const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Action = sequelize.define(
  "ActionMarketing",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    nom: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  },
);

module.exports = Action;
