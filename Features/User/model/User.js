const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/database");

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
    },
    role: {
      type: DataTypes.ENUM("admin", "marketeur", "responsable"),
      defaultValue: "marketeur",
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
  }
);

module.exports = User;
