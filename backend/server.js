const express = require("express");
const http = require("http");
const {Server} = require("socket.io");

const cors = require("cors");


const app = express();

// middleware

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET","POST"]
    }

});

//socket io connection

io.on("connection", (socket) => {
  console.log("user connected ", socket.id);
   
  // socket.on("sendMessage", (message) => {
  //   console.log("message received ", message);

  //   io.emit("receiveMessage" , message);
  // });

  // socket.on("ruvu", (msg) => {
  //   console.log("Ruvaaaaa ", msg );

  //   io.emit("receiveMessage", msg);
  // })

  // join chat room

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log( `${socket.id} joined ${roomId}`);
    socket.emit("roomJoined", roomId);
  });

  // send message inside a room

  socket.on("sendMessage", ({roomId, message, senderName}) => {
          if (!roomId || !message?.trim()) return;
          console.log("message recevied ", message);

          io.to(roomId).emit("receiveMessage", {
            message,
            senderName,
            roomId
          })
  });

  socket.on("disconnect", () => {
console.log("user disconnected ", socket.id);
  });
} );

app.get("/", (req,res) => {
  res.send("Hey i m working");
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("server is working on port ", PORT)
});

//module.exports = server;