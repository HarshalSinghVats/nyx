const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');  // Import the cors package

const app = express();
const server = http.createServer(app);

// Use dynamic URL based on environment
const frontendUrl = process.env.NODE_ENV === 'production'
  ? 'https://nyx-steel.vercel.app'  // Frontend URL for production
  : 'http://localhost:3000';  // Frontend URL for local development

const io = socketIo(server, {
  cors: {
    origin: frontendUrl,  // Allow frontend URLs dynamically based on environment
    methods: ['GET', 'POST'],
  },
});

// Enable CORS for your express app
app.use(cors({
  origin: frontendUrl,  // Use dynamic URL for CORS
  methods: ['GET', 'POST'],
}));

io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for incoming chat messages
  socket.on('chat message', (msg) => {
    console.log('Received message from user:', msg);

    // Send a confirmation back to the sender that the message was received
    socket.emit('message_received', {
      content: msg.content,
      sender: msg.sender,
      timestamp: new Date(),
    });
    console.log('Sent message received confirmation:', msg);

    // Broadcast the message to all other users (excluding the sender)
    socket.broadcast.emit('chat message', msg);
    console.log('Broadcasting message to other users:', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Use environment variable for the port in production or fallback to 5000
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
