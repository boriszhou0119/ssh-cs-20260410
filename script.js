const STORAGE_KEY = "todo-app-items";
const MAX_TODO_LENGTH = 100;

const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const countText = document.getElementById("count-text");
const clearCompletedBtn = document.getElementById("clear-completed");
const filterBtns = document.querySelectorAll(".filter-btn");

let todos = [];
let currentFilter = "all";

function loadTodos() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    todos = stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("加载待办失败:", error);
    todos = [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function getFilteredTodos() {
  if (currentFilter === "active") return todos.filter((t) => !t.completed);
  if (currentFilter === "completed") return todos.filter((t) => t.completed);
  return todos;
}

function renderTodos() {
  const filtered = getFilteredTodos();
  todoList.innerHTML = "";

  filtered.forEach((todo) => {
    const li = document.createElement("li");
    li.className = `todo-item ${todo.completed ? "completed" : ""}`;
    li.dataset.id = todo.id;

    li.innerHTML = `
      <input type="checkbox" class="todo-checkbox" ${todo.completed ? "checked" : ""}>
      <span class="todo-text">${escapeHtml(todo.text)}</span>
      <button type="button" class="todo-delete">删除</button>
    `;

    const checkbox = li.querySelector(".todo-checkbox");
    const deleteBtn = li.querySelector(".todo-delete");

    checkbox.addEventListener("change", () => toggleTodo(todo.id));
    deleteBtn.addEventListener("click", () => removeTodo(todo.id));

    todoList.appendChild(li);
  });

  updateCount();
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function updateCount() {
  const activeCount = todos.filter((t) => !t.completed).length;
  countText.textContent = `${activeCount} 项待办`;
}

function addTodo() {
  const text = todoInput.value.trim();
  if (!text) return;

  if (text.length > MAX_TODO_LENGTH) {
    todoInput.value = text.slice(0, MAX_TODO_LENGTH);
    return;
  }

  const newTodo = {
    id: Date.now().toString(),
    text,
    completed: false,
  };

  todos.push(newTodo);
  saveTodos();
  todoInput.value = "";
  renderTodos();
}

function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return;
  todo.completed = !todo.completed;
  saveTodos();
  renderTodos();
}

function removeTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
  renderTodos();
}

function clearCompleted() {
  todos = todos.filter((t) => !t.completed);
  saveTodos();
  renderTodos();
}

function setFilter(filter) {
  currentFilter = filter;
  filterBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === filter);
  });
  renderTodos();
}

addBtn.addEventListener("click", addTodo);

todoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTodo();
});

clearCompletedBtn.addEventListener("click", clearCompleted);

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => setFilter(btn.dataset.filter));
});

loadTodos();
renderTodos();
