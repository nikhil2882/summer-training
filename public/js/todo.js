const todoTextNode = document.getElementById("new-todo");
const addTodoButton = document.getElementById("add-todo");

const userName = prompt("Enter your name");

getTodos();

addTodoButton.addEventListener("click", function () {
  const todoTextValue = todoTextNode.value;

  if (todoTextValue) {
    saveTodo(todoTextValue, function (error) {
      if (error) {
        alert(error);
      } else {
        addTodoToDOM(todoTextValue);
      }
    });
  } else {
    alert("Please enter a todo");
  }
});

function saveTodo(todo, callback) {
  fetch("/todo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: todo, createdBy: userName }),
  }).then(function (response) {
    if (response.status === 200) {
      callback();
    } else {
      callback("Something went wrong");
    }
  });
}

function addTodoToDOM(todo) {
  const todoList = document.getElementById("todo-list");
  const todoItem = document.createElement("li");
  todoItem.innerText = todo;
  todoList.appendChild(todoItem);

  todoItem.addEventListener("click", function () {
    deleteTodo(todo, function (error) {
      if (error) {
        alert(error);
      } else {
        todoList.removeChild(todoItem);
      }
    });
  });
}

function getTodos() {
  fetch("/todos?name=" + userName)
    .then(function (response) {
      if (response.status !== 200) {
        throw new Error("Something went wrong");
      }
      return response.json();
    })
    .then(function (todos) {
      todos.forEach(function (todo) {
        addTodoToDOM(todo.text);
      });
    })
    .catch(function (error) {
      alert(error);
    });
}

function deleteTodo(todo, callback) {
  fetch("/todo", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: todo, createdBy: userName }),
  }).then(function (response) {
    if (response.status === 200) {
      callback();
    } else {
      callback("Something went wrong");
    }
  });
}
