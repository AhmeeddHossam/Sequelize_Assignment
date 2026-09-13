const { Sequelize } = require("sequelize");

const dialect = process.env.DB_DIALECT || "mysql";

// SQLite is only used to run the project locally without a MySQL server,
// the default (and the one used for grading) is MySQL.
const sequelize =
  dialect === "sqlite"
    ? new Sequelize({
        dialect: "sqlite",
        storage: process.env.DB_STORAGE || "assignment5.sqlite",
        logging: false,
      })
    : new Sequelize(
        process.env.DB_NAME || "assignment5",
        process.env.DB_USER || "root",
        process.env.DB_PASSWORD || "",
        {
          host: process.env.DB_HOST || "localhost",
          port: process.env.DB_PORT || 3306,
          dialect: "mysql",
          logging: false,
        }
      );

const dbConnection = async () => {
  await sequelize.authenticate();
  console.log("Database connected successfully");

  // creates the tables if they do not exist
  await sequelize.sync();
  console.log("Models synchronized successfully");
};

module.exports = { sequelize, dbConnection };
