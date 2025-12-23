const sequelize = require("../../../config/database");

const Form_ConcuAccessoire = sequelize.define(
  "Form_ConcuAccessoire",
  {},
  {
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = Form_ConcuAccessoire;
