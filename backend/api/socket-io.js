
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
     path: "/api/socket-io/socket.io",
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`${socket.id} joined ${roomId}`);
    socket.emit("roomJoined", roomId);
  });

  socket.on("sendMessage", ({ roomId, message, senderName }) => {
    if (!roomId || !message?.trim()) return;

    io.to(roomId).emit("receiveMessage", {
      message,
      senderName,
      roomId
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Hey i m working");
});

module.exports = server;
