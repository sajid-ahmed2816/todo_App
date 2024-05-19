import { Box, Grid, TextField, Button, Paper, IconButton } from '@mui/material';
import { ModeEdit, Delete, Task, AddCircle, ArrowRight, CheckCircle, Backspace, Check } from '@mui/icons-material';
import { useState, useEffect, Fragment } from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.css';
import axios from 'axios';
import { addTodo, getTodos, updateTodo, deleteTodo, deleteAllTodos, completeTodo, deleteCompletedTodos } from './firebase';

function App() {

  const [text, setText] = useState("");
  const [todos, setTodos] = useState([]);
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const [completeTodos, setCompleteTodos] = useState([]);
  const [edit, setEdit] = useState("");
  const [updatedText, setUpdatedText] = useState("")

  const handleAdd = (todo) => {
    console.log("🚀 ~ handleAdd ~ todo:", todo)
    if (todo.trim === "") {
      alert("Please enter a to-do item");
      return;
    }
    addTodo(todo);
    setText("");
    setTodos([...todos, { item: todo, completed: false }]);
    setUpdateTrigger(!updateTrigger);
  }

  function clearText() {
    setText("")
  }

  const handleEdit = (id, item) => {
    setEdit(id);
    setUpdatedText(item);
  };

  const handleUpdateTodo = (id) => {
    updateTodo(id, updatedText);
    setEdit(null);
    setUpdatedText("");
    setUpdateTrigger(!updateTrigger)
  };

  const handleDelete = (id) => {
    const todo = todos.find(todo => todo.id === id);
    const completedTodo = completeTodos.find(todo => todo.id === id);

    if (todo) {
      deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } else if (completedTodo && completedTodo.completed) {
      deleteTodo(id);
      setCompleteTodos(completeTodos.filter(todo => todo.id !== id));
    };
    setUpdateTrigger(!updateTrigger);
  };

  const handleDeleteAll = () => {
    deleteAllTodos();
    setUpdateTrigger(!updateTrigger);
  };

  const handleComplete = (id) => {
    completeTodo(id, true);
    const completedTodo = todos.find(todo => todo.id === id);
    if (completedTodo) {
      completedTodo.completed = true;
      setCompleteTodos([...completeTodos, completedTodo]);
      setTodos(todos.filter(todo => todo.id !== id));
    }
    setUpdateTrigger(!updateTrigger);
  };

  const handleDeleteCompleted = async () => {
    await deleteCompletedTodos();
    setCompleteTodos([]);
    setUpdateTrigger(!updateTrigger);
  };

  useEffect(() => {
    async function fetchTodos() {
      const todosFromDB = await getTodos();
      const todosArray = Object.entries(todosFromDB || {}).map(([id, todo]) => ({ id, ...todo }));
      setTodos(todosArray.filter(todo => !todo.completed));
      setCompleteTodos(todosArray.filter(todo => todo.completed));
    }

    fetchTodos();
  }, [updateTrigger]);

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
          {todos.map((item, index) => (
            <Paper
              key={index}
              variant={edit !== item?.id && 'outlined'}
              sx={{
                marginBlock: "10px",
                padding: edit === item?.id ? 0 : "13.5px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              {edit === item?.id ? (
                <TextField
                  value={updatedText}
                  fullWidth
                  onChange={(e) => setUpdatedText(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() =>
                          handleUpdateTodo(item?.id)
                        }
                      >
                        <Check />
                      </IconButton>
                    )
                  }}
                />
              ) : (
                <Fragment>
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
                    <IconButton
                      onClick={() => handleComplete(item.id)}
                    >
                      <Task sx={{ color: "#388e3c" }} />
                    </IconButton>
                    <IconButton
                      onClick={() => handleEdit(item.id, item.item)}
                    >
                      <ModeEdit sx={{ color: "#1976d2" }} />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(item.id)}
                    >
                      <Delete sx={{ color: "#c62828" }} />
                    </IconButton>
                  </Box>
                </Fragment>
              )}
            </Paper>
          ))}
          {todos.length === 0 ?
            "No todos added yet" :
            <Button
              fullWidth
              variant='outlined'
              onClick={handleDeleteAll}
            >
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
                <IconButton
                  onClick={() => handleDelete(item.id)}
                >
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
              onClick={handleDeleteCompleted}
            >
              Clear All
            </Button>}
        </Grid>

      </Grid>
    </Box >

  );
}

export default App;
