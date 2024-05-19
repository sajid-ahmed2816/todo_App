// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set, child, get, push, update, remove, query, orderByChild, equalTo } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {

  apiKey: "AIzaSyAiu2zA6npyFjpobUGIb9aFBNz7dr_FoOE",
  authDomain: "todoapp-5b80e.firebaseapp.com",
  projectId: "todoapp-5b80e",
  storageBucket: "todoapp-5b80e.appspot.com",
  messagingSenderId: "920366743942",
  appId: "1:920366743942:web:c77efb52c0cd7c405fec07",
  measurementId: "G-1E67PQH46E",
  databaseURL: "https://todoapp-5b80e-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase();

export function addTodo(todo) {
  console.log("🚀 ~ todo:", todo)
  const newTodoRef = push(ref(database, "todos"));
  set(newTodoRef, {
    item: todo,
    completed: false,
  });
}

export async function getTodos() {
  const databaseRef = ref(database);
  try {
    const snapshot = await get(child(databaseRef, "todos"));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No data available");
      return [];
    }
  } catch (err) {
    console.log(err);
    return [];
  };
};

export function updateTodo(id, updatedItem) {
  const todoRef = ref(database, `todos/${id}`);
  return update(todoRef, {
    item: updatedItem,
  });
};

export function deleteTodo(id) {
  const todoRef = ref(database, `todos/${id}`);
  return remove(todoRef);
};

export function deleteAllTodos() {
  const todoRef = ref(database, "todos");
  return remove(todoRef);
};

export function completeTodo(id, completed) {
  const todoRef = ref(database, `todos/${id}`);
  return update(todoRef, {
    completed: completed,
  });
};

export async function deleteCompletedTodos() {
  const dbRef = ref(database, 'todos');
  const completedTodosQuery = query(dbRef, orderByChild('completed'), equalTo(true));

  try {
    const snapshot = await get(completedTodosQuery);
    if (snapshot.exists()) {
      const updates = {};
      snapshot.forEach((childSnapshot) => {
        updates[childSnapshot.key] = null;
      });
      return update(dbRef, updates);
    };
  } catch (error) {
    console.error(error);
  };
};