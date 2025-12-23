const express = require("express");
const { db } = require("./relation");

const app = express();
const port = 3000;
const hostname = "localhost";
const AuthRoute = require("./Features/Auth/route/Auth.route");
const CadeauRoute = require("./Features/Cadeau/route/Cadeau.route");
const ConcurrentRoute = require("./Features/Concurrent/route/Concurrent.route");
const LocationRoute = require("./Features/Location/route/location.route");
const MissionRoute = require("./Features/Mission/route/mission.route");
const ProductRoute = require("./Features/Product/route/Product.route");
const ProductConcuRoute = require("./Features/Product_Concurrent/route/ProdConcurrent.route");
const SourceApproRoute = require("./Features/SourceAppro/route/source.route");
const UserRoute = require("./Features/User/route/User.route");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", AuthRoute);
app.use("/api/cadeau", CadeauRoute);
app.use("/api/concurrent", ConcurrentRoute);
app.use("/api/location", LocationRoute);
app.use("/api/mission", MissionRoute);
app.use("/api/product", ProductRoute);
app.use("/api/productConcu", ProductConcuRoute);
app.use("/api/sourceAppro", SourceApproRoute);
app.use("/api/user", UserRoute);

db.authenticate()
  .then(() => {
    console.log("DB connected");
    return db.sync({ force: true });
  })
  .then(() => {
    app.listen(port, hostname, () => {
      console.log(`Server started on http://${hostname}:${port}`);
    });
  })
  .catch((err) => console.error("DB error:", err));
