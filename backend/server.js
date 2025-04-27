const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');  // Import the cors package

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",  // Allow requests from your frontend
    methods: ["GET", "POST"],        // Allow these methods
  }
});

// Enable CORS for your express app
app.use(cors({
  origin: 'http://localhost:3000',   // Allow frontend at localhost:3000
  methods: ['GET', 'POST'],         // Allow these methods
}));

io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for incoming chat messages
  socket.on('chat message', (msg) => {
    console.log('Received message from user:', msg);  // Log the message received

    // Send a confirmation back to the sender that the message was received
    socket.emit('message_received', {
      content: msg.content,
      sender: msg.sender,
      timestamp: new Date(),
    });
    console.log('Sent message received confirmation:', msg);  // Log the confirmation sent

    // Broadcast the message to all other users (excluding the sender)
    socket.broadcast.emit('chat message', msg);
    console.log('Broadcasting message to other users:', msg); // Log the broadcasting action

    // Optionally, if you want to send the message to all clients (including the sender)
    // io.emit('chat message', msg);  // This sends the message to all clients, including the sender
    // console.log('Broadcasting message to all clients:', msg); // Log the broadcasting to all clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
