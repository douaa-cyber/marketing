const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

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
      type: DataTypes.ENUM("Exist", "ExistNot"), //exist   means la source exist dans lERP sinon si new.
      allowNull: false,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

module.exports = SourceAppro;
