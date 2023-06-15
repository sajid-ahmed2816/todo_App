const mongoose = require('mongoose');

const completeTodoSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
  }
},
  {
    timestamps: true
  }
);

const completeTodoModel = mongoose.model("compeleteTodo", completeTodoSchema);

module.exports = completeTodoModel;