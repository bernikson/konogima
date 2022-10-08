//! Setting up server
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    origin: "",
  },
});

//! Express middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//! Connections
server.listen();
