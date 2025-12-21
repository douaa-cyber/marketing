const sequelize = require("../config/database");

const Form_ProdAccessoire = sequelize.define(
  "Form_ProdAccessoire",
  {},
  {
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = Form_ProdAccessoire;
