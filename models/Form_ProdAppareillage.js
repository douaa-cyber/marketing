const sequelize = require("../config/database");

const Form_ProdAppareillage = sequelize.define(
  "Form_ProdAppareillage",
  {},
  {
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = Form_ProdAppareillage;
