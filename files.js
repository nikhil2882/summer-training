const fs = require("fs");

function onFileRead(err, data) {
  if (err) {
    console.log(err);
  } else {
    console.log(data);
  }
}

function onFileWrite(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("File written successfully");

    //fs.readFile("./abc.jpeg", "utf-8", onFileRead);
  }
}

fs.writeFile("./abc.jpeg", "lorem ipsum dolor sit amet", onFileWrite);
fs.readFile("./abc.jpeg", "utf-8", onFileRead);

console.log("This is a message");
