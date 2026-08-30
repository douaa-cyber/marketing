const sequelize = require("../../../config/database");
const { DataTypes } = require("sequelize");
const Form_Concu = sequelize.define(
  "Form_Concu",
  {
    formId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    concurrentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    categorieId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  },
);

module.exports = Form_Concu;
