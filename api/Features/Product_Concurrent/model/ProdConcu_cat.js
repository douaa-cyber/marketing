const sequelize = require("../../../config/database");

const ProdConcuCat = sequelize.define(
  "ProdConcuCat",
  {},
  {
    timestamps: false,
    freezeTableName: true,
  },
);

module.exports = ProdConcuCat;
