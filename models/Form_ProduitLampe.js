const sequelize = require("../config/database");

const Form_ProdLampe = sequelize.define(
  "Form_ProdLampe",
  {},
  {
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = Form_ProdLampe;
