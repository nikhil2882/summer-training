const express = require("express");
const fs = require("fs");
const app = express();

app.use(function (req, res, next) {
  // execute anything before the route handler here

  // without next(), the request will hang
  // because express wont pass the request to the next handler

  console.log(req.method, req.url);
  next();
});

app.use(express.json());

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/public/index.html");
});

app.get("/about", function (request, response) {
  response.sendFile(__dirname + "/public/about.html");
});

app.get("/contact", function (request, response) {
  response.sendFile(__dirname + "/public/contact.html");
});

app.get("/style.css", function (request, response) {
  response.sendFile(__dirname + "/public/css/style.css");
});

app.get("/todo", function (request, response) {
  response.sendFile(__dirname + "/public/todo.html");
});

app.get("/todos", function (request, response) {
  const name = request.query.name;

  getTodos(name, false, function (error, todos) {
    if (error) {
      response.status(500);
      response.json({ error: error });
    } else {
      response.status(200);
      response.json(todos);
    }
  });
});

app.post("/todo", function (request, response) {
  const todo = request.body;

  saveTodos(todo, function (error) {
    if (error) {
      response.status(500);
      response.json({ error: error });
    } else {
      response.status(200);
      response.send();
    }
  });
});

app.get("/todo.js", function (request, response) {
  response.sendFile(__dirname + "/public/js/todo.js");
});

app.get("*", function (request, response) {
  response.sendFile(__dirname + "/public/404.html");
});

app.listen(8000, function () {
  console.log("Server is running on port 8000");
});

function getTodos(username, all, callback) {
  fs.readFile("./todos.mp4", "utf-8", function (error, data) {
    if (error) {
      callback(error);
    } else {
      if (data.length === 0) {
        data = "[]";
      }

      try {
        let todos = JSON.parse(data);

        if (all) {
          callback(null, todos);
          return;
        }

        const filteredTodos = todos.filter(function (todo) {
          return todo.createdBy === username;
        });

        callback(null, filteredTodos);
      } catch (error) {
        callback(null, []);
      }
    }
  });
}

function saveTodos(todo, callback) {
  getTodos(null, true, function (error, todos) {
    if (error) {
      callback(error);
    } else {
      todos.push(todo);

      fs.writeFile("./todos.mp4", JSON.stringify(todos), function (error) {
        if (error) {
          callback(error);
        } else {
          callback();
        }
      });
    }
  });
}
