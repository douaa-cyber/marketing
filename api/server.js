const express = require("express");
const { db } = require("./relation");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const AuthRoute = require("./Features/Auth/route/Auth.route");
const CadeauRoute = require("./Features/Cadeau/route/Cadeau.route");
const ConcurrentRoute = require("./Features/Concurrent/route/Concurrent.route");
const LocationRoute = require("./Features/Location/route/location.route");
const MissionRoute = require("./Features/Mission/route/mission.route");
const ProductRoute = require("./Features/Product/route/Product.route");
const ProductConcuRoute = require("./Features/Product_Concurrent/route/ProdConcurrent.route");
const SourceApproRoute = require("./Features/SourceAppro/route/source.route");
const UserRoute = require("./Features/User/route/User.route");
const ActiviteRoute = require("./Features/Activite/route/Activite.route");
const FormRoute = require("./Features/form/route/Form.route");
const VehiculeRoute = require("./Features/vehicule/vehicule.route");
const DashboardRoute = require("./Features/Dashboard/Stat.router");
const CriteriaRoute = require("./Features/Critere/critere.routes");
const ActionMarkRoute = require("./Features/ActionMarketing/action.routes");

const app = express();
const port = process.env.PORT;
const hostname = process.env.hostname;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://10.19.36.193:5173",
      "http://192.168.2.231:5173",
      "http://192.168.2.42:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", AuthRoute);
app.use("/api/cadeau", CadeauRoute);
app.use("/api/activite", ActiviteRoute);
app.use("/api/concurrent", ConcurrentRoute);
app.use("/api/location", LocationRoute);
app.use("/api/mission", MissionRoute);
app.use("/api/product", ProductRoute);
app.use("/api/vehicule", VehiculeRoute);
app.use("/api/productConcu", ProductConcuRoute);
app.use("/api/sourceAppro", SourceApproRoute);
app.use("/api/user", UserRoute);
app.use("/api/form", FormRoute);
app.use("/api/dashboard", DashboardRoute);
app.use("/api/criteria", CriteriaRoute);
app.use("/api/action", ActionMarkRoute);

db.authenticate()
  .then(() => {
    console.log("DB connected");
    return db.sync({ alter: true });
  })
  .then(() => {
    app.listen(port, hostname, () => {
      console.log(`Server started on http://${hostname}:${port}`);
    });
  })
  .catch((err) => console.error("DB error:", err));
