const express = require("express");
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

app.post("/todo", function (request, response) {
  console.log(request.body);
  response.status(200);
  response.send();
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
