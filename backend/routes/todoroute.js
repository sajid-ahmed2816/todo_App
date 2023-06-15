const express = require('express');
const todoModel = require('../model/todomodel');
const completeTodoModel = require('../model/completetodomodel');
const route = express.Router();

route.get("/", async (req, res) => {
  try {
    let result = await todoModel.find()
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

route.post("/", async (req, res) => {
  try {
    let todoItem = req.body;
    let item = todoItem
    if (!item) {
      res.status(400).send("Please enter to do");
    }
    else {
      let createTodo = new todoModel(item);
      await createTodo.save();
      if (!createTodo) {
        res.status(400).send("Internal error");
      }
      else {
        res.status(200).send({ status: true, data: createTodo, message: "Saved successfully" });
        console.log(createTodo)
      }
    }
  }
  catch {
    res.status(400).send("Internal error");
  }
});

route.put("/:id", async (req, res) => {
  let id = req.params.id;
  let updatedItem = req.body.item;
  try {
    let result = await todoModel.findById(id);
    if (!result) {
      res.status(400).send({ status: false, message: "No data found" });
    }
    else {
      await todoModel.findByIdAndUpdate(id, { item: updatedItem }, { new: true })
      res.status(200).send({ status: true, data: result, message: "Updated successfully" });
    }
  }
  catch {
    res.status(400).send("Internal error");
  }
});

route.delete("/:id", async (req, res) => {
  let id = req.params.id
  try {
    let result = await todoModel.findById(id);
    if (!result) {
      res.status(400).send("No data found");
    }
    else {
      await todoModel.findByIdAndDelete(id);
      res.status(200).send({ status: true, Message: "Delete successfully" });
    }
  }
  catch {
    res.status(400).send("Internal error");
  }
});

route.delete("/", async (req, res) => {
  try {
    let result = await todoModel.find();
    if (!result) {
      res.status(400).send({ status: false, Message: "No data found" });
    }
    else {
      await todoModel.deleteMany({});
      res.status(200).send({ status: true, Message: "All items deleted successfully" });
    }
  }
  catch {
    res.status(400).send("Internal error");
  }
});

module.exports = route;