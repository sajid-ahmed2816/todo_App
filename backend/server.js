const express = require('express');
const mongoose = require('mongoose');
const todoRoute = require('./routes/todoroute');
const completeTodoRoute = require('./routes/completetodoroute');
const cors = require('cors');
require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/todo", todoRoute);
app.use("/api/todo/completed", completeTodoRoute);

mongoose.connect(process.env.MONGO_URI)
  .then((
    app.listen(process.env.PORT, () => {
      console.log("Database connected successfully and server connected on Port 3001");
    })
  ))
  .catch((err) => {
    console.log(err);
  });