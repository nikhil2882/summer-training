const express = require("express");
const fs = require("fs");
const app = express();
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

var session = require("express-session");

app.set("view engine", "ejs");

app.use(express.static("public"));

// if you want to change the default folder for views
// you can use the following line
//app.set("views" , __dirname + "/public");

app.use(express.static("uploads"));

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

// single will be used if you are uploading a single file
// array will be used if you are uploading multiple files
// pic is the name of the input field in the form
app.use(upload.single("pic"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function (request, response) {
  if (request.session.isLoggedIn) {
    console.log(request.session.username);
    response.render("index", { username: request.session.username });
    return;
  }

  response.redirect("/login");
});

app.get("/login", function (request, response) {
  if (request.session.isLoggedIn) {
    response.redirect("/");
    return;
  }

  response.render("login", { error: null });
});

app.get("/signup", function (request, response) {
  response.render("signup", { error: null });
});

app.get("/about", function (request, response) {
  response.sendFile(__dirname + "/public/about.html");
});

app.get("/contact", function (request, response) {
  response.sendFile(__dirname + "/public/contact.html");
});

// comment this out if you are using the static middleware
/* app.get("/style.css", function (request, response) {
  response.sendFile(__dirname + "/public/css/style.css");
}); */

app.get("/todo", function (request, response) {
  if (!request.session.isLoggedIn) {
    response.redirect("/login");
    return;
  }

  const userName = request.session.username;
  const profilePic = request.session.profilePic;

  getTodos(userName, false, function (error, todos) {
    if (error) {
      response.status(500);
      response.json({ error: error });
    } else {
      response.render("todo", {
        todos: todos,
        userName: userName,
        profilePic: profilePic,
      });
    }
  });
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

  todo.createdBy = request.session.username;

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

// comment this out if you are using the static middleware
/* app.get("/todo.js", function (request, response) {
  response.sendFile(__dirname + "/public/js/todo.js");
});
 */
app.post("/login", function (request, response) {
  const username = request.body.username;
  const password = request.body.password;

  getAllUsers(function (error, users) {
    if (error) {
      response.render("login", { error: error });
    } else {
      const user = users.find(function (user) {
        return user.username === username && user.password === password;
      });

      if (user) {
        request.session.isLoggedIn = true;
        request.session.username = username;
        request.session.profilePic = user.profilePic;

        response.redirect("/");
      } else {
        response.render("login", { error: "Invalid username or password" });
      }
    }
  });
});

app.post("/signup", function (request, response) {
  const username = request.body.username;
  const password = request.body.password;
  const profilePic = request.file;

  const user = {
    username: username,
    password: password,
    profilePic: profilePic.filename,
  };

  saveUser(user, function (error) {
    if (error) {
      response.render("signup", { error: error });
    } else {
      response.redirect("/login");
    }
  });
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

function getAllUsers(callback) {
  fs.readFile("./users.gif", "utf-8", function (error, data) {
    if (error) {
      callback(error);
    } else {
      if (data.length === 0) {
        data = "[]";
      }

      try {
        let users = JSON.parse(data);
        callback(null, users);
      } catch (error) {
        callback(null, []);
      }
    }
  });
}

function saveUser(user, callback) {
  getAllUsers(function (error, users) {
    if (error) {
      callback(error);
    } else {
      users.push(user);

      fs.writeFile("./users.gif", JSON.stringify(users), function (error) {
        if (error) {
          callback(error);
        } else {
          callback();
        }
      });
    }
  });
}
