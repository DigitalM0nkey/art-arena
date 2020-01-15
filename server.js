const express = require("express");
const http = require("http");
const app = express();
require('dotenv').config();
const db = require("./db");

const server = http.createServer(app);
const sockets = require("./sockets").init(server);

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use("/api/rooms", require("./api/rooms"));

server.listen(process.env.PORT || 8080, () => {
  console.log("Server listening on Port 8080");
});

// routing
// index page
app.get("/", function(req, res) {
  res.render("pages/index");
});
