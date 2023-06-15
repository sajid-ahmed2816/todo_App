import { Box, Grid, TextField, Button, Paper, IconButton } from '@mui/material';
import { ModeEdit, Delete, Task, AddCircle, ArrowRight, CheckCircle, Backspace } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.css';
import axios from 'axios';

function App() {

  const [text, setText] = useState("");
  const [todo, setTodo] = useState([]);
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const [completeTodos, setCompleteTodos] = useState([]);

  const todoURL = "http://localhost:3001/api/todo/"

  function handleAdd(data) {
    if (!data || data === "") {
      alert("Please enter to do")
    }
    else {
      axios.post(todoURL, { item: data })
        .then((res) => {
          console.log(res.data);
          setUpdateTrigger(!updateTrigger)
        })
        .catch((err) => {
          console.log(err)
        })
      setText("");
    }
  }

  function clearText() {
    setText("")
  }

  function handleComplete(id, iscompleted) {
    const completed = iscompleted = true;
    axios.put(`${todoURL}completed/${id}`, { completed })
      .then((res) => {
        console.log(res.data);
        setUpdateTrigger(!updateTrigger);
      })
      .catch((err) => {
        console.log(err);
      })
    const completedTodo = todo.find((todo) => todo._id === id);
    if (completedTodo) {
      setTodo((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
    }
    console.log("id", id);
    console.log(completedTodo);
    console.log(completed)
  }

  function handleEdit(id, item) {
    let updatedItem = { item: prompt("", item) };
    axios.put(`${todoURL}${id}`, updatedItem)
      .then((res) => {
        console.log(res.data);
        setUpdateTrigger(!updateTrigger);
      })
      .catch((err) => {
        console.log(err)
      })
    console.log("id", id)
  }

  function handleDel(id) {
    axios.delete(`${todoURL}${id}`)
      .then((res) => {
        console.log(res.data)
        setUpdateTrigger(!updateTrigger)
      })
      .catch((err) => {
        console.log(err)
      })
    console.log("id", id)
  }

  function handleDeleteAll() {
    axios.delete(todoURL)
      .then((res) => {
        console.log(res.data);
        setUpdateTrigger(!updateTrigger);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  function handleDelCompTodo(id) {
    axios.delete(`${todoURL}completed/${id}`)
      .then((res) => {
        console.log(res.data)
        setUpdateTrigger(!updateTrigger)
      })
      .catch((err) => {
        console.log(err)
      })
    console.log("id", id)

  }

  function handleClearAll() {
    axios.delete(`${todoURL}completed/delete/deleteall`)
      .then((res) => {
        console.log(res.data);
        setUpdateTrigger(!updateTrigger);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    axios.get(todoURL)
      .then((res) => {
        setTodo(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      })
    axios.get(`${todoURL}completed`)
      .then((res) => {
        setCompleteTodos(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [updateTrigger])

  return (

    <Box className="App">
      <Grid container>

        <Grid
          item xs={12} sm={12} md={12} lg={5} xl={6}
          sx={{
            padding: "20px",
          }}
        >
          <h1>To Do App</h1>
          <TextField
            value={text}
            fullWidth
            onChange={(e) => setText(e.target.value)}
            label="Enter your to do"
          />
          <Box
            sx={{
              display: 'flex',
              gap: "10px"
            }}
          >
            <Button
              sx={{
                marginBlock: "10px",
                display: "flex",
                gap: "5px"
              }}
              fullWidth
              variant='contained'
              onClick={() => handleAdd(text)}>
              Add
              <AddCircle />
            </Button>
            <Button
              sx={{
                marginBlock: "10px",
                display: "flex",
                gap: "5px"
              }}
              fullWidth
              variant='contained'
              onClick={clearText}>
              Clear
              <Backspace />
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={3.5} xl={3} sx={{ padding: "20px", textAlign: "center" }}>
          <h1>Your to do list</h1>
          {todo.map((item, index) => (
            <Paper
              key={index}
              variant='outlined'
              sx={{
                marginBlock: "10px",
                padding: "13.5px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Box sx={{
                display: "flex",
              }}>
                <ArrowRight />{item.item}
              </Box>
              <Box sx={{
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}>
                <IconButton onClick={() => handleComplete(item._id, item.completed)}>
                  <Task sx={{ color: "#388e3c" }} />
                </IconButton>
                <IconButton onClick={() => handleEdit(item._id, item.item)}>
                  <ModeEdit sx={{ color: "#1976d2" }} />
                </IconButton>
                <IconButton onClick={() => handleDel(item._id)}>
                  <Delete sx={{ color: "#c62828" }} />
                </IconButton>
              </Box>
            </Paper>
          ))}
          {todo.length === 0 ?
            "Please enter your to do" :
            <Button
              fullWidth
              variant='outlined'
              onClick={handleDeleteAll}>
              Delete All
            </Button>}
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={3.5} xl={3} sx={{ padding: "20px", textAlign: "center" }}>
          <h1>Completed to do</h1>
          {completeTodos.map((item, index) => (
            <Paper
              key={index}
              variant='outlined'
              sx={{
                marginBlock: "10px",
                padding: "13.5px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Box sx={{
                display: "flex",
                gap: "5px"
              }}>
                <CheckCircle sx={{ color: "#388e3c" }} />
                {item.item}
              </Box>
              <Box>
                <IconButton onClick={() => handleDelCompTodo(item._id)}>
                  <Delete sx={{ color: "#1976d2" }} />
                </IconButton>
              </Box>
            </Paper>
          ))}
          {completeTodos.length === 0 ?
            "No task completed yet" :
            <Button
              fullWidth
              variant='outlined'
              onClick={handleClearAll}>
              Clear All
            </Button>}
        </Grid>

      </Grid>
    </Box >

  );
}

export default App;
