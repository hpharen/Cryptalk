const { io } = require('socket.io-client');

const socket = io('http://localhost:5090'); // Make sure this matches your server's URL

socket.on('connect', () => {
  console.log('Connected to the server!');
});

socket.on('connect_error', (err) => {
  console.error('Connection failed:', err);
});

socket.on('disconnect', () => {
  console.log('Disconnected from the server');
});
