const sequelize = require("../../../config/database");

const Form_ConcuAccess = sequelize.define(
  "Form_ConcuAccess",
  {},
  {
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = Form_ConcuAccess;
