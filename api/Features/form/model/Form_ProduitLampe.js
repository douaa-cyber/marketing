const sequelize = require("../../../config/database");
const { DataTypes } = require("sequelize");

const Form_ProdLampe = sequelize.define(
  "Form_ProdLampe",
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

module.exports = Form_ProdLampe;
