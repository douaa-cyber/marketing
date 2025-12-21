const sequelize = require("../config/database");

const Form_SourceAppro = sequelize.define(
  "Form_SourceAppro",
  {},
  {
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = Form_SourceAppro;
