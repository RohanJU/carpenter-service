const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const config = require("./src/config");
const connectDB = require("./src/persistence/connectDB");
const employeeRoute = require("./src/routes/employee");
const adminAuthRoute = require("./src/routes/admin.auth");
const adminRoute = require("./src/routes/admin");
const orderRoute = require("./src/routes/order");
const employeeAuthRoute = require("./src/routes/employee.auth");
const app = express();

const logPrefix = "INDEX:";

morgan(":method :url :status :res[content-length] - :response-time ms");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/employee", employeeRoute);
app.use("/auth/admin", adminAuthRoute);
app.use("/admin", adminRoute);
app.use("/order", orderRoute);
app.use("/auth/employee", employeeAuthRoute);

app.get("/", (__, res) => {
  return res.status(200).json({
    app: config.app,
    version: "1.0.0",
  });
});

app.use("*", (__, res) => {
  console.log(__.baseUrl);
  return res.status(404).json({
    status: 404,
    message: "Invalid Path",
    data: null,
  });
});

const startApp = () => {
  app.listen(config.port, async () => {
    await connectDB(config.mongo.uri, config.mongo.db);
    console.log(
      `${logPrefix} server connected with database and running on port: ${config.port}`
    );
  });
};

startApp();
