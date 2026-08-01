const express = require("express");

const mongoose = require("mongoose");
require("dotenv").config();



const app = express();
const http = require('http');
const { Server } = require('socket.io');


const cors = require('cors');
app.use(cors());
// Middleware

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.error("Error connecting to MongoDB:", error));

app.use("/api/users", require("./routes/userRoutes"));


app.get("/", (req, res) => {
  res.send("Backend Running");
});

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Simple in-memory room/connections/messages store
const connections = {};
const messages = {};
const timeOnline = {};

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('join-call', (path) => {
    if (!connections[path]) connections[path] = [];
    connections[path].push(socket.id);
    timeOnline[socket.id] = Date.now();

    // notify everyone in room
    connections[path].forEach((id) => {
      io.to(id).emit('user-joined', socket.id, connections[path]);
    });

    // replay messages
    if (messages[path]) {
      messages[path].forEach((m) => {
        io.to(socket.id).emit('chat-message', m.data, m.sender, m['socket-id-sender']);
      });
    }
  });

  socket.on('signal', (told, message) => {
    io.to(told).emit('signal', socket.id, message);
  });

  socket.on('chat-message', (data, sender) => {
    // find room
    const room = Object.keys(connections).find((r) => connections[r].includes(socket.id));
    if (!room) return;
    if (!messages[room]) messages[room] = [];
    messages[room].push({ data, sender, 'socket-id-sender': socket.id });
    connections[room].forEach((id) => io.to(id).emit('chat-message', data, sender, socket.id));
  });

  socket.on('disconnect', () => {
    const diff = Date.now() - (timeOnline[socket.id] || Date.now());
    // remove from any room
    for (const [room, arr] of Object.entries(connections)) {
      const idx = arr.indexOf(socket.id);
      if (idx !== -1) {
        arr.splice(idx, 1);
        // notify others
        arr.forEach((id) => io.to(id).emit('user-left', socket.id, diff));
        if (arr.length === 0) {
          delete connections[room];
          delete messages[room];
        }
      }
    }
    delete timeOnline[socket.id];
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.post("/test", (req, res) => {
  console.log(req.body);
  res.json(req.body);
});