require("dotenv/config");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const socketio = require("socket.io");
const http = require("http");

const routes = require("./routes.js");

const PositionController = require("./io/PositionController.js");

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const app = express();
const server = http.Server(app);
const io = socketio(server);

const connectedUsers = {};

io.on("connection", socket => {
  console.log(`Socket connected: ${socket.id}`);
  const { user_id } = socket.handshake.query;

  connectedUsers[user_id] = socket.id;

  socket.on("xyz", PositionController.xyz);
  socket.on("rotation", PositionController.rotation);
  socket.on("elevation", PositionController.elevation);
  socket.on("extension", PositionController.extension);
  socket.on("gripper", PositionController.gripper);
});

app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;
  return next();
});

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);
