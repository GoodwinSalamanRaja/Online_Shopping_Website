const express = require("express");
const app = express();
const socketIo = require("socket.io");

const http = require("http");

const server = http.createServer(app);

const io = socketIo(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("user connected",socket.id);

  socket.on("joinRoom", (room) => {
    // console.log(msg);
    socket.join(room)
    console.log(`User ${socket.id} joined ${room}`);
  });

  socket.on("leaveRoom",(room) => {
    socket.leave(room)
    console.log(`User ${socket.id} left ${room}`);
  })

  socket.emit("test",{test:"pass"})

  socket.on("demo",(name) => {console.log("name",name);})

  socket.on("disconnect", () => {
    console.log("User disconnected",socket.id);
  });
       
});

module.exports = io

server.listen(8080, (e) => {
  if (!e) {
    console.log("Server started successfully");
  } else {
    console.log("Server failed to start");
  }
});

const cors = require("cors");
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/user", require("./router/user"));
app.use("/admin", require("./router/admin"));
app.use(
  "/product",
  require("./controller/product").uploader,
  require("./router/product")
);
app.use("/public", express.static(__dirname + "/uploads"));
app.use("/category", require("./router/category"));
app.use("/cart", require("./router/cart"));

const mongoose = require("mongoose");
const mongoDbUrl = "mongodb://localhost:27017/demo";
mongoose
  .connect(mongoDbUrl)
  .then(() => {
    console.log(`${mongoDbUrl} connected successfully`);
  })
  .catch((error) => {
    console.log("Failed to start db");
  });
