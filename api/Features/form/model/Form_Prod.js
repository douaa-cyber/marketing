const sequelize = require("../../../config/database");
const { DataTypes } = require("sequelize");
const Form_Prod = sequelize.define(
  "Form_Prod",
  {
    formId: DataTypes.INTEGER,
    produitId: DataTypes.INTEGER,
    categorieId: DataTypes.INTEGER,
    nbArticle: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nbArticleCommande: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  },
);

module.exports = Form_Prod;
