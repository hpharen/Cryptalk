require('dotenv').config();
const { io } = require('socket.io-client');
const readline = require('readline'); // Allows user input from terminal

// Connect to the WebSocket server
const socket = io('http://localhost:5090', {
  auth: {
    token: process.env.USER_TOKEN, // JWT token from .env
  },
});

// Interface for sending messages via terminal input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Event when connected
socket.on('connect', () => {
  console.log(`Connected to server with socket ID: ${socket.id}`);
});

// Event when receiving a message
socket.on('receive_message', (data) => {
  console.log(`New message from ${data.senderId}: ${data.message}`);
});

// Function to send messages
const sendMessage = () => {
  rl.question('Enter receiverId: ', (receiverId) => {
    rl.question('Enter your message: ', (message) => {
      socket.emit('send_message', { receiverId, message });
      sendMessage(); // Loop for continuous input
    });
  });
};

// Start message input
sendMessage();
