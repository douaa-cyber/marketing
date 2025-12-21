const sequelize = require("../config/database");

const Form_ProdConcuApp = sequelize.define(
  "Form_ProdConcuApp",
  {},
  {
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = Form_ProdConcuApp;
