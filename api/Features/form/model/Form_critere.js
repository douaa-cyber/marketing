const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/database");

const Form_Critere = sequelize.define(
  "Form_Critere",
  {
    is_checked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  },
);

module.exports = Form_Critere;
