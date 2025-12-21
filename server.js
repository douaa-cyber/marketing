const express = require("express");
const { db } = require("./models");

const app = express();
const port = 3000;
const hostname = "localhost";

db.authenticate()
  .then(() => {
    console.log("DB connected");
    return db.sync();
  })
  .then(() => {
    app.listen(port, hostname, () => {
      console.log(`Server started on http://${hostname}:${port}`);
    });
  })
  .catch((err) => console.error("DB error:", err));
