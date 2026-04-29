const sequelize = require("../../../config/database");
const { DataTypes } = require("sequelize");
const Form_Concu = sequelize.define(
  "Form_Concu",
  {
    formId: DataTypes.INTEGER,
    concurrentId: DataTypes.INTEGER,
    categorieId: DataTypes.INTEGER,
  },
  {
    timestamps: false,
    freezeTableName: true,
  },
);

module.exports = Form_Concu;
