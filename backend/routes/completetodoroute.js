const express = require('express');
const todoModel = require('../model/todomodel');
const completeTodoModel = require('../model/completetodomodel');
const route = express.Router();

route.get("/", async (req, res) => {
  try {
    let result = await completeTodoModel.find()
    if (!result) {
      res.status(400).send("No data found");
    }
    else {
      res.status(200).send({ status: true, data: result });
    }
  }
  catch {
    res.status(400).send("Internal error");
  }
});

route.put("/:id", async (req, res) => {
  const id = req.params.id;
  const completed = req.body.completed;
  try {
    let result = await todoModel.findOne({ _id: id });
    if (!result) {
      res.status(404).send({ status: false, message: "No data found" });
    }
    else {
      if (completed) {
        if (!result.completed) {
          result.completed = true;
          const completeTodoItem = new completeTodoModel({
            _id: result._id,
            item: result.item,
            completed: result.completed
          });
          await completeTodoItem.save();
          await todoModel.findByIdAndDelete(id);
          res.status(200).send({ status: true, data: completeTodoItem, message: "Todo complete and moved to completed" });
        } else {
          res.status(200).send("Todo item is already marked as complete");
        }
      }
    }
  } catch (error) {
    res.status(400).send("Internal error");
  }
});

route.delete("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let result = await completeTodoModel.findById(id);
    if (!result) {
      res.status(404).send("No data found");
    }
    else {
      await completeTodoModel.findByIdAndDelete(id);
      res.status(200).send("Deleted successfully")
    }
  }
  catch (e) {
    res.status(404).send("Internal server error");
  }
});

route.delete("/delete/deleteall", async (req, res) => {
  try {
    let result = await completeTodoModel.deleteMany({ completed: true });
    if (result.deletedCount === 0) {
      res.status(400).send({ status: false, Message: "No data found" });
    } else {
      res.status(200).send({ status: true, Message: "All items deleted successfully" });
    }
  }
  catch {
    res.status(500).send("Internal error");
  }
});

module.exports = route;