const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },

    fullname: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    password: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },

    roles: {
      type: DataTypes.ENUM("marketeur", "responsable"),
      allowNull: false,
    },

    societe: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

module.exports = User;
