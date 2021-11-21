require("dotenv").config();
const cors = require("cors");

const express = require("express");
const http = require("http");

const db = require("./Shared/Mongo");

//routes
const userRoute = require("./Routes/UsersRoute");

const app = express();

const server = http.createServer(app);

let startServer = async () => {
  try {
    await db.connect();

    //for checking to browser;
    app.get("/", (req, res, next) => {
      res.status(200).send("server is running successfully");
      console.log("server is running successfully");
      next();
    });

    app.use(express.json());
    //middlewares
    app.use("/users", userRoute);

    const port = process.env.PORT || 3001;
    server.listen(port, () => {
      console.log("server is runnging at", port);
    });
  } catch (err) {
    console.log(err);
  }
};
startServer();
