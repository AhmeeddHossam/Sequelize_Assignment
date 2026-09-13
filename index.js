require("dotenv").config();
const express = require("express");
const { dbConnection } = require("./src/database/dbConnection");
require("./src/database/models"); // register the models and their relations
const bootstrap = require("./src/index.routes");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Assignment 5 - Sequelize APIs are running" });
});

bootstrap(app);

dbConnection()
  .then(() => {
    app.listen(port, () => console.log(`Server is running on port ${port}`));
  })
  .catch((error) => {
    console.error("Unable to connect to the database :", error.message);
    process.exit(1);
  });

module.exports = app;
