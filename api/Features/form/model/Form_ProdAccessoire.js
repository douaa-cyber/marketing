const sequelize = require("../../../config/database");
const { DataTypes } = require("sequelize");

const Form_ProdAccessoire = sequelize.define(
  "Form_ProdAccessoire",
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

module.exports = Form_ProdAccessoire;
