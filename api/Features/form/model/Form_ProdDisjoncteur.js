const sequelize = require("../../../config/database");
const { DataTypes } = require("sequelize");

const Form_ProdDisj = sequelize.define(
  "Form_ProdDisj",
  {
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

module.exports = Form_ProdDisj;
