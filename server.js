const app = require("./index");
const {sequelize} = require("./models")

const port = 3000;

async function startServer() {
    try {
      await sequelize.authenticate();
      console.log("Database connection has been established successfully.");
  
      app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
      });
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }
  
  startServer();