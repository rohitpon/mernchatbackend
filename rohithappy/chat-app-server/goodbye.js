const express = require('express');
const mongoose = require('mongoose');
const socketio = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = app.listen(3000);
const io = socketio(server);

const MessageSchema = new mongoose.Schema({
  sender: { type: String },
  receiver: { type: String },
  text: { type: String },
  scheduledAt: { type: Date },
});

const MessageModel = mongoose.model('Message', MessageSchema);

// Schedule a message to be sent
const scheduleMessage = (message, delay) => {
  setTimeout(() => {
    io.emit('newMessage', message);
  }, delay);
};

// Example
const message = {
  sender: 'John Doe',
  receiver: 'Jane Doe',
  text: 'Hello, how are you?',
  scheduledAt: new Date(Date.now() + 10000), // 10 seconds
};

scheduleMessage(message, 10000);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from MERN stack chat application!');
});

io.on('connection', (socket) => {
  socket.on('sendMessage', (data) => {
    const message = {
      sender: socket.username,
      receiver: data.receiver,
      text: data.text,
      scheduledAt: new Date(data.scheduledAt),
    };
    MessageModel.create(message, (err, message) => {
      if (err) {
        console.log(err);
      } else {
        io.emit('newMessage', message);
      }
    });
  });
});
