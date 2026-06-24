/* 
Точка входа в приложение
Запуск coordinator и базы данных
*/
require("dotenv").config();
const models = require("./models/index");
const app = require("./app");
const sequelize = require("./config/db");

// models init
require("./models/User");
require("./models/Bucket");
require("./models/File");
require("./models/Node");

async function start() {
  try {
    await sequelize.authenticate();
    console.log("DB connected");

    await sequelize.sync({ alter: true });

    await sequelize.authenticate();
console.log("DB NAME:", sequelize.config.database);
    console.log("DB synced");
    console.log("DB CONFIG:", {
  host: sequelize.config.host,
  port: sequelize.config.port,
  database: sequelize.config.database,
  dialect: sequelize.getDialect()
});

const [result] = await sequelize.query("SELECT current_database()");
console.log("BACKEND DB:", result);

    app.listen(process.env.PORT, () => {
      console.log(`Backend running on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
}

start();