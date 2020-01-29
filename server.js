const express = require("express");
const http = require("http");
const bodyParser = require('body-parser');
require('dotenv').config();
const db = require("./db");


const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.json());   // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use("/api/arenas", require("./api/arenas"));
app.use(express.static("public"));

const server = http.createServer(app);
const sockets = require("./sockets").init(server);
server.listen(process.env.PORT || 8080, () => {
  console.log("Server listening on Port 8080");
});

// routing
// index page
app.get("/", function(req, res) {
  res.render("pages/index");
});
