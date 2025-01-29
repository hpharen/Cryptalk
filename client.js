const { io } = require('socket.io-client');

// Replace with actual user IDs
const senderId = '3'; // User 3's ID (sender)
const receiverId = '4'; // User 4's ID (receiver)

const socket = io('http://localhost:5090'); // Connect to the server

// Debugging
console.log("Connecting to the server...");

socket.on('connect', () => {
  console.log('Successfully connected to server!');
});

// Authenticate the user with their userId
socket.emit('authenticate', senderId);

// Listen for incoming messages
socket.on('receive_message', (msg) => {
  console.log('New message:', msg);
});

// Send a message from user 3 to user 4
setTimeout(() => {
  socket.emit('send_message', {
    senderId: senderId, // Sender's ID (user 3)
    receiverId: receiverId, // Receiver's ID (user 4)
    message: 'Hello from user 3!',
  });
}, 2000);
