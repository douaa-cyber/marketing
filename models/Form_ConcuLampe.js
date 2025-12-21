const sequelize = require("../config/database");

const Form_ConcuLampe = sequelize.define(
  "Form_ConcuLampe",
  {},
  {
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = Form_ConcuLampe;
