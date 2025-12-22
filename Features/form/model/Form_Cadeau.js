const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/database");

const CadeauForm = sequelize.define("cadeau_form", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cadeau_id: DataTypes.INTEGER,
  form_id: DataTypes.INTEGER,
  quantity: DataTypes.INTEGER,
});

module.exports = CadeauForm;
