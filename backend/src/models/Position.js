const mongoose = require("mongoose");

const PositionSchema = new mongoose.Schema({
  alpha: Number,
  beta: Number,
  theta: Number,
  x: Number,
  y: Number,
  z: Number
});

module.exports = mongoose.model("Position", PositionSchema);
