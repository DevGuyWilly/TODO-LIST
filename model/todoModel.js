const mongoose = require("mongoose");

// creating the todoList Schema
const todoListScheme = new mongoose.Schema({
  name: {
    type: String,
  },
});

const list = mongoose.model("list", todoListScheme);

module.exports = list;
