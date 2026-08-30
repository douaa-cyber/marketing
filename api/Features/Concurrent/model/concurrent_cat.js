const sequelize = require("../../../config/database");

const ConcuCat = sequelize.define(
  "ConcuCat",
  {},
  {
    timestamps: false,
    freezeTableName: true,
  },
);

module.exports = ConcuCat;
