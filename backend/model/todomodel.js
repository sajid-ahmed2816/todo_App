const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
},
  {
    timestamps: true
  }
);

const todoModel = mongoose.model("Todo", todoSchema);

module.exports = todoModel;