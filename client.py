import socketio
import time

# Create a new Socket.IO client
sio = socketio.Client()

# This event is triggered once the connection is established
@sio.event
def connect():
    print("Successfully connected to server!")

# This event will handle incoming messages
@sio.event
def receive_message(data):
    print(f"New message from {data['senderId']}: {data['message']}")

# Authenticate the user with their userId
@sio.event
def authenticate(data):
    print(f"User {data['userId']} authenticated")

# Send a message after 2 seconds
def send_message():
    time.sleep(2)  # Simulate delay
    message_data = {
        "senderId": "3",
        "receiverId": "4",
        "message": "Hello from user 3!"
    }
    sio.emit('send_message', message_data)

# Connect to the Node.js Socket.io server
sio.connect('http://localhost:5090')

# Authenticate the user
sio.emit('authenticate', {'userId': '3'})

# Send a message
send_message()

# Run the client to keep listening for events
sio.wait()
