const sequelize = require("../config/database");

const Form_ProdConcuAcc = sequelize.define(
  "Form_ProdConcuAcc",
  {},
  {
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = Form_ProdConcuAcc;
