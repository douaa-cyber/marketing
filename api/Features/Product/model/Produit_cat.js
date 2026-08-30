const sequelize = require("../../../config/database");

const ProdCat = sequelize.define(
  "ProdCat",
  {},
  {
    timestamps: false,
    freezeTableName: true,
  },
);

module.exports = ProdCat;
