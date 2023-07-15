const http = require("http");
const fs = require("fs");

const server = http.createServer(onRequest);

function onRequest(request, response) {
  if (request.method === "GET") {
    if (request.url === "/") {
      readHTML("./public/index.html", function (data) {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(data);
        response.end();
      });
      // figure out why return keyword is used here
      return;
    }

    if (request.url === "/about") {
      readHTML("./public/about.html", function (data) {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(data);
        response.end();
      });

      return;
    }

    if (request.url === "/contact") {
      readHTML("./public/contact.html", function (data) {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(data);
        response.end();
      });

      return;
    }

    response.writeHead(404, { "Content-Type": "text/plain" });
    response.write("not handled");
    response.end();
  } else {
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.write("not handled");
    response.end();
  }
}

server.listen(8000, function () {
  console.log("Server is running on port 3000");
});

function readHTML(filePath, callback) {
  fs.readFile(filePath, function (err, data) {
    if (err) {
      throw err;
    }
    callback(data);
  });
}
