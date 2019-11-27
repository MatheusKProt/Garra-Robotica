const express = require("express");

const routes = express.Router();

const PositionController = require("./controllers/PositionController.js");

// routes.get("/position", PositionController.index);

// routes.post("/generate", PositionController.store);

module.exports = routes;
