const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mysql = require("mysql2");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "your_password",
  database: "chatapp"
});

db.connect();

io.on("connection", (socket) => {

  socket.on("chat message", (data) => {
    // save to DB
    db.query(
      "INSERT INTO messages (username, message) VALUES (?, ?)",
      [data.sender, data.message]
    );

    io.emit("chat message", data);
  });

});

server.listen(3000, "0.0.0.0", () => {
  console.log("Server running on all devices");
});
