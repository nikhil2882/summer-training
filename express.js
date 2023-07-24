const express = require("express");
const fs = require("fs");
const app = express();

var session = require("express-session");

app.use(function (req, res, next) {
  // execute anything before the route handler here

  // without next(), the request will hang
  // because express wont pass the request to the next handler

  console.log(req.method, req.url);
  next();
});

app.use(
  session({
    secret: "iamasecret on a linux",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function (request, response) {
  if (request.session.isLoggedIn) {
    console.log(request.session.username);
    response.sendFile(__dirname + "/public/index.html");
    return;
  }

  response.redirect("/login");
});

app.get("/login", function (request, response) {
  if (request.session.isLoggedIn) {
    response.redirect("/");
    return;
  }

  response.sendFile(__dirname + "/public/login.html");
});

app.get("/signup", function (request, response) {
  response.sendFile(__dirname + "/public/signup.html");
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

app.delete("/todo", function (request, response) {
  const todo = request.body;

  getTodos(null, true, function (error, todos) {
    if (error) {
      response.status(500);
      response.json({ error: error });
    } else {
      const filteredTodos = todos.filter(function (todoItem) {
        return todoItem.text !== todo.text;
      });

      fs.writeFile(
        "./todos.mp4",
        JSON.stringify(filteredTodos),
        function (error) {
          if (error) {
            response.status(500);
            response.json({ error: error });
          } else {
            response.status(200);
            response.send();
          }
        }
      );
    }
  });
});

app.get("/todo.js", function (request, response) {
  response.sendFile(__dirname + "/public/js/todo.js");
});

app.post("/login", function (request, response) {
  const username = request.body.username;
  const password = request.body.password;

  if (username === "n" && password === "n") {
    request.session.isLoggedIn = true;
    request.session.username = username;

    response.redirect("/");
  } else {
    response.status(403);
    response.send();
  }
});

app.post("/signup", function (request, response) {
  const username = request.body.username;
  const password = request.body.password;

  if (username === "n" && password === "n") {
    response.redirect("/login");
  } else {
    response.status(403);
    response.send();
  }
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
