const sequelize = require("../../../config/database");
const { DataTypes } = require("sequelize");
const Form_ProdConcu = sequelize.define(
  "Form_ProdConcu",
  {
    formId: DataTypes.INTEGER,
    prodConcuId: DataTypes.INTEGER,
    categorieId: DataTypes.INTEGER,
  },
  {
    timestamps: false,
    freezeTableName: true,
  },
);

module.exports = Form_ProdConcu;
