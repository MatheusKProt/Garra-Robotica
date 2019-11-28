const express = require("express");

const routes = express.Router();

const PositionController = require("./controllers/PositionController.js");

// routes.post("/generate", PositionController.store);

module.exports = routes;
