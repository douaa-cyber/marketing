const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/database");

const Form_Action = sequelize.define(
  "Form_Action",
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

module.exports = Form_Action;
