const sequelize = require("../config/database");

const Form_ConcuDisj = sequelize.define(
  "Form_ConcuDisj",
  {},
  {
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = Form_ConcuDisj;
