require("dotenv").config();
const cors = require("cors");

const express = require("express");
const http = require("http");

const db = require("./Shared/Mongo");

const app = express();

const server = http.createServer(app);

let startServer = async () => {
  try {
    await db.connect();

    //for checking to browser;
    app.get("/", (req, res) => {
      res.status(200).send("server is running successfully");
      console.log("server is running successfully");
    });

    const port = process.env.PORT || 3001;
    app.listen(port, () => {
      console.log("server is runnging at", port);
    });
  } catch (err) {
    console.log(err);
  }
};
startServer();
