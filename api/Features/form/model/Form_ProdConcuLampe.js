const sequelize = require("../../../config/database");

const Form_ProdConcuLampe = sequelize.define(
  "Form_ProdConcuLampe",
  {},
  {
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = Form_ProdConcuLampe;
