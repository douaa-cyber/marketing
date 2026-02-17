const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/database");

const SourceAppro = sequelize.define(
  "SourceAppro",
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
    Surname: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    tel: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    region: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM("Exist", "ExistNot"),
      allowNull: false,
    },
    mode_vente: {
      type: DataTypes.ENUM("distribution_direct", "super_gros", "demi_gros"),
      allowNull: true,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  },
);

module.exports = SourceAppro;
