const sequelize = require("../config/database");

const Form_ProdDisj = sequelize.define(
  "Form_ProdDisj",
  {},
  {
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = Form_ProdDisj;
