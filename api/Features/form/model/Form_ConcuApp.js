const sequelize = require("../../../config/database");

const Form_ConcuApp = sequelize.define(
  "Form_ConcuAppareillage",
  {},
  {
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = Form_ConcuApp;
