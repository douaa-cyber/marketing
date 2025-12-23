const sequelize = require("../../../config/database");

const Form_ProdConcuDisj = sequelize.define(
  "Form_ProdConcuDisj",
  {},
  {
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = Form_ProdConcuDisj;
